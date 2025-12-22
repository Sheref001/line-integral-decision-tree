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

  // Reset downstream steps
  document.getElementById("step-field").classList.remove("hidden");
  document.getElementById("step-method").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
}

function chooseField(type) {
  fieldType = type;

  // Always hide method step first
  document.getElementById("step-method").classList.add("hidden");

  // Scalar fields: student must choose method
  if (fieldType === "scalar") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Vector fields: no method choice
  if (fieldType === "vector") {
    showResult();
  }
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

// ------------------------------------------------
// Result logic (mathematically correct)
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  let formula = "";
  let explanation = "";

  // ----------------------------------------------
  // Plane curve — scalar field
  // ----------------------------------------------
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x')^2+(y')^2}\\,dt$$
    `;
    explanation =
      "This integral measures accumulation of the scalar field along the curve itself. The arc length element ds accounts for the geometry of the path.";
  }

  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = `
    $$\\int_C f\\,dx
    \\quad \\text{or} \\quad
    \\int_C f\\,dy$$
    `;
    explanation =
      "Here accumulation is measured relative to a chosen coordinate direction, not intrinsic arc length.";
  }

  // ----------------------------------------------
  // Plane curve — vector field
  // ----------------------------------------------
  if (curveType === "plane" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy
    =
    \\int_a^b (P x' + Q y')\\,dt$$
    `;
    explanation =
      "The dot product extracts the component of the vector field tangent to the curve. This integral represents work done along the path.";
  }

  // ----------------------------------------------
  // Space curve — scalar field
  // ----------------------------------------------
  if (curveType === "space" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt$$
    `;
    explanation =
      "The scalar field is accumulated along the spatial curve, with ds capturing the curve's geometry in space.";
  }

  // ----------------------------------------------
  // Space curve — vector field
  // ----------------------------------------------
  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$
    `;
    explanation =
      "The line integral sums the tangential component of the vector field along the space curve, interpreted as work.";
  }

  // Inject content
  formulaDiv.innerHTML = formula;
  explanationDiv.innerText = explanation;

  document.getElementById("result").classList.remove("hidden");

  // Force MathJax rendering
  if (window.MathJax) {
    MathJax.typesetClear([formulaDiv]);
    MathJax.typesetPromise([formulaDiv]);
  }
}

// ------------------------------------------------
// Reset
// ------------------------------------------------
function resetTree() {
  curveType = "";
  fieldType = "";
  methodType = "";

  document.querySelectorAll(".step").forEach(step => {
    step.classList.add("hidden");
  });

  document.getElementById("step-curve").classList.remove("hidden");
  document.getElementById("step-method").classList.add("hidden");
  document.getElementById("formula").innerHTML = "";
  document.getElementById("explanation").innerText = "";
}
