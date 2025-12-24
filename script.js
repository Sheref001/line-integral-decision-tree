// ------------------------------------------------
// MathJax Utilities (centralized, reusable)
// ------------------------------------------------
function renderMath(elements = null) {
  if (!window.MathJax) return;

  MathJax.typesetPromise(elements ?? undefined)
    .catch(err => console.error("MathJax rendering error:", err));
}

// ------------------------------------------------
// State variables
// ------------------------------------------------
let curveType = "";
let fieldType = "";
let methodType = "";

// ------------------------------------------------
// Step handlers
// ------------------------------------------------
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
  showResult();
}

// ------------------------------------------------
// Result display
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");
  const resultDiv = document.getElementById("result");

  // These variables are assumed to be computed earlier
  // formula
  // explanationHTML
  // naturalExplanation (optional)

  formulaDiv.innerHTML = formula ?? "";
  explanationDiv.innerHTML = explanationHTML ?? "";

  if (typeof naturalExplanation === "string" && naturalExplanation.trim() !== "") {
    naturalDiv.innerHTML = naturalExplanation;
    naturalDiv.classList.remove("hidden");
  } else {
    naturalDiv.innerHTML = "";
    naturalDiv.classList.add("hidden");
  }

  resultDiv.classList.remove("hidden");

  // ✅ Safe, centralized MathJax rendering
  renderMath([formulaDiv, explanationDiv, naturalDiv]);
}

// ------------------------------------------------
// Utilities
// ------------------------------------------------
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
}
