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

  // Reset downstream UI
  hideAllSteps();
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;

  // Always hide method step first
  document.getElementById("step-method").classList.add("hidden");

  // Scalar fields: must choose ds vs coordinates
  if (fieldType === "scalar") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Vector fields: no choice, go directly to result
  if (fieldType === "vector") {
    methodType = "";
    showResult();
  }
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

// ------------------------------------------------
// Result logic (faithful to TikZ)
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");

  let formula = "";
  let explanation = "";

  // Reset special case
  naturalDiv.classList.add("hidden");
  naturalDiv.innerHTML = "";

  // =================================================
  // Plane curve — scalar field
  // =================================================
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y)\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x')^2+(y')^2}\\,dt$$
    `;
    explanation =
      "This integral accumulates the scalar field along the curve itself. The factor ds accounts for the geometry of the path.";

    // Natural parametrization (special case)
    naturalDiv.innerHTML = `
    <b>Special case: natural parametrization</b><br><br>
    $$\\text{If } y=g(x):\\quad
    \\int_C f\\,ds
    =
    \\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx$$
    $$\\text{If } x=h(y):\\quad
    \\int_C f\\,ds
    =
    \\int_a^b f(h(y),y)\\sqrt{1+(h'(y))^2}\\,dy$$
    `;
    naturalDiv.classList.remove("hidden");
  }

  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = `
    $$\\int_C f(x,y)\\,dx
    \\quad \\text{or} \\quad
    \\int_C f(x,y)\\,dy$$
    `;
    explanation =
      "Here accumulation is measured relative to a chosen coordinate direction. The result depends on how the curve is traversed.";
  }

  // =================================================
  // Plane curve — vector field
  // =================================================
  if (curveType === "plane" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy
    =
    \\int_a^b (P x' + Q y')\\,dt$$
    `;
    explanation =
      "The dot product extracts the tangential component of the vector field. This line integral represents work done along the curve.";
  }

  // =================================================
  // Space curve — scalar field
  // =================================================
  if (curveType === "space" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y,z)\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt$$
    `;
    explanation =
      "The scalar field is accumulated along the space curve, with ds capturing the curve's geometry in three dimensions.";
  }

  // =================================================
  // Space curve — vector field
  // =================================================
  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int\limits_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int\limits_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$
    `;
    explanation =
      "This integral sums the tangential component of the vector field along the space curve, interpreted as work.";
  }

  // Inject content
  formulaDiv.innerHTML = formula;
  explanationDiv.innerText = explanation;
  document.getElementById("result").classList.remove("hidden");

  // Force MathJax rendering
  if (window.MathJax) {
    MathJax.typesetClear([formulaDiv, naturalDiv]);
    MathJax.typesetPromise([formulaDiv, naturalDiv]);
  }
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
  document.getElementById("step-curve").classList.remove("hidden");

  document.getElementById("formula").innerHTML = "";
  document.getElementById("explanation").innerText = "";
  document.getElementById("natural-param").innerHTML = "";
  document.getElementById("natural-param").classList.add("hidden");
}
