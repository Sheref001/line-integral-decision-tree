// ================================================================
// GLOBAL SAFE STATE (prevents ReferenceError crashes)
// ================================================================
window.formula = "";
window.explanationHTML = "";
window.naturalExplanation = "";

// ================================================================
// MathJax Utilities (centralized, safe)
// ================================================================
function renderMath(elements = null) {
  if (!window.MathJax) return;

  MathJax.typesetPromise(elements ?? undefined)
    .catch(err => console.error("MathJax rendering error:", err));
}

// ================================================================
// State variables
// ================================================================
let curveType = "";
let fieldType = "";
let methodType = "";

// ================================================================
// Step handlers
// ================================================================
function chooseCurve(type) {
  curveType = type;
  methodType = "";
  hideAllSteps();
  resetResult();
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;
  methodType = "";

  const stepMethod = document.getElementById("step-method");

  stepMethod.classList.add("hidden");
  resetResult();

  document.getElementById("btn-ds").classList.add("hidden");
  document.getElementById("btn-dxdy").classList.add("hidden");
  document.getElementById("btn-dxyz").classList.add("hidden");

  if (curveType === "plane") {
    if (fieldType === "scalar") {
      stepMethod.classList.remove("hidden");
      document.getElementById("btn-ds").classList.remove("hidden");
      document.getElementById("btn-dxdy").classList.remove("hidden");
    }
    if (fieldType === "vector") {
      methodType = "coord";
      computeResult();
      showResult();
    }
  }

  if (curveType === "space") {
    if (fieldType === "scalar") {
      stepMethod.classList.remove("hidden");
      document.getElementById("btn-ds").classList.remove("hidden");
      document.getElementById("btn-dxyz").classList.remove("hidden");
    }
    if (fieldType === "vector") {
      stepMethod.classList.remove("hidden");
      document.getElementById("btn-dxyz").classList.remove("hidden");
    }
  }
}

function chooseMethod(type) {
  methodType = type;
  computeResult();
  showResult();
}

// ================================================================
// Decision logic (this matches your original intent)
// ================================================================
function computeResult() {
  window.formula = "";
  window.explanationHTML = "";
  window.naturalExplanation = "";

  // ------------------------------------------------
  // Plane curve — scalar field
  // ------------------------------------------------
  if (curveType === "plane" && fieldType === "scalar") {
    if (methodType === "ds") {
      window.formula = `
      \\[
      \\int_C f(x,y)\\, ds
      \\]
      `;
      window.explanationHTML = `
      You are integrating a scalar field along a plane curve.
      The natural choice is the line integral with respect to arc length.
      `;
    }

    if (methodType === "dxdy") {
      window.formula = `
      \\[
      \\int_C f(x,y)\\,dx + g(x,y)\\,dy
      \\]
      `;
      window.explanationHTML = `
      The curve is described in Cartesian form, so integration
      with respect to \\(x\\) and \\(y\\) is appropriate.
      `;
    }
  }

  // ------------------------------------------------
  // Plane curve — vector field (coordinate form)
  // ------------------------------------------------
  if (curveType === "plane" && fieldType === "vector") {
    window.formula = `
    \\[
    \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    = \\int_C P(x,y)\\,dx + Q(x,y)\\,dy
    \\]
    `;
    window.explanationHTML = `
    For a vector field in the plane, the line integral represents
    work done by the field along the curve.
    `;
  }

  // ------------------------------------------------
  // Space curve — scalar field
  // ------------------------------------------------
  if (curveType === "space" && fieldType === "scalar") {
    if (methodType === "ds") {
      window.formula = `
      \\[
      \\int_C f(x,y,z)\\, ds
      \\]
      `;
      window.explanationHTML = `
      A scalar field integrated along a space curve
      uses the arc length differential.
      `;
    }

    if (methodType === "dxyz") {
      window.formula = `
      \\[
      \\int_C f(x,y,z)
      \\left|
      \\frac{d\\mathbf{r}}{dt}
      \\right| dt
      \\]
      `;
      window.explanationHTML = `
      When the curve is parametrized, the integral
      is naturally written in terms of the parameter.
      `;
    }
  }

  // ------------------------------------------------
  // Space curve — vector field
  // ------------------------------------------------
  if (curveType === "space" && fieldType === "vector") {
    window.formula = `
    \\[
    \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    = \\int_C
    \\left(
    P\\,dx + Q\\,dy + R\\,dz
    \\right)
    \\]
    `;
    window.explanationHTML = `
    The line integral of a vector field in space
    measures the work done along the curve.
    `;
  }
}

// ================================================================
// Result display
// ================================================================
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");
  const resultDiv = document.getElementById("result");

  formulaDiv.innerHTML = window.formula;
  explanationDiv.innerHTML = window.explanationHTML;

  if (window.naturalExplanation && window.naturalExplanation.trim() !== "") {
    naturalDiv.innerHTML = window.naturalExplanation;
    naturalDiv.classList.remove("hidden");
  } else {
    naturalDiv.innerHTML = "";
    naturalDiv.classList.add("hidden");
  }

  resultDiv.classList.remove("hidden");

  renderMath([formulaDiv, explanationDiv, naturalDiv]);
}

// ================================================================
// Utilities
// ================================================================
function hideAllSteps() {
  document.querySelectorAll(".step").forEach(step => {
    step.classList.add("hidden");
  });
}

function resetTree() {
  curveType = "";
  fieldType = "";
  methodType = "";

  hideAllSteps();
  resetResult();
  document.getElementById("step-curve").classList.remove("hidden");
}

function resetResult() {
  const resultDiv = document.getElementById("result");
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");

  resultDiv.classList.add("hidden");

  formulaDiv.innerHTML = "";
  explanationDiv.innerHTML = "";

  naturalDiv.innerHTML = "";
  naturalDiv.classList.add("hidden");

  window.formula = "";
  window.explanationHTML = "";
  window.naturalExplanation = "";
}
