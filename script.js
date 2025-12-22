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

  hideAllSteps();
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;

  // Always hide method step first
  document.getElementById("step-method").classList.add("hidden");

  // Scalar fields: choose how to integrate
  if (fieldType === "scalar") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Vector fields: no method choice
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
// Result logic (faithful to TikZ + MathJax-safe)
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
  // Plane curve R^2 — scalar field f(x,y)
  // =================================================
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y)\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x')^2+(y')^2}\\,dt$$
    `;
    explanation =
      "This integral measures the accumulation of the scalar field \\(f(x,y)\\) along the curve itself. The element \\(ds\\) accounts for the geometry of the curve.";

    // Natural parametrization (special case)
    naturalDiv.innerHTML = `
    <b>Special case: natural parametrization</b><br><br>
    $$\\text{If } y=g(x):\\quad
    \\int_C f(x,y)\\,ds
    =
    \\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx$$
    $$\\text{If } x=h(y):\\quad
    \\int_C f(x,y)\\,ds
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
      "Here the scalar field \\(f(x,y)\\) is accumulated relative to a chosen coordinate direction rather than intrinsic arc length.";
  }

  // =================================================
  // Plane curve R^2 — vector field <P,Q>
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
      "This line integral represents the work done by the vector field \\(\\langle P,Q \\rangle\\) along the plane curve, computed using coordinate differentials.";
  }

  // =================================================
  // Space curve R^3 — scalar field f(x,y,z)
  // =================================================
  if (curveType === "space" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y,z)\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt$$
    `;
    explanation =
      "The scalar field \\(f(x,y,z)\\) is accumulated along the space curve, with \\(ds\\) capturing the geometry in three dimensions.";
  }

  // =================================================
  // Space curve R^3 — vector field <P,Q,R>
  // =================================================
  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$
    `;
    explanation =
      "This line integral represents the work done by the vector field \\(\\langle P,Q,R \\rangle\\) along the space curve, computed using coordinate differentials \\(dx,dy,dz\\).";
  }

  // Inject content (IMPORTANT: innerHTML for LaTeX)
  formulaDiv.innerHTML = formula;
  explanationDiv.innerHTML = explanation;
  document.getElementById("result").classList.remove("hidden");

  // Force MathJax rendering on all math-containing nodes
  if (window.MathJax) {
    MathJax.typesetClear([formulaDiv, explanationDiv, naturalDiv]);
    MathJax.typesetPromise([formulaDiv, explanationDiv, naturalDiv]);
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
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("natural-param").innerHTML = "";
  document.getElementById("natural-param").classList.add("hidden");
}
