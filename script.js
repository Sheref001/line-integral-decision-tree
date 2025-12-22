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
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;

  // Scalar fields: student must choose how to integrate
  if (fieldType === "scalar") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Vector fields: no choice — always coordinate differentials
  if (fieldType === "vector") {
    showResult();
  }
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

// ------------------------------------------------
// Result logic (MathJax-safe and mathematically correct)
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  let formula = "";

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
  }

  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = `
    $$\\int_C f\\,dx
    \\quad \\text{or} \\quad
    \\int_C f\\,dy$$
    `;
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
  }

  // Inject formula
  formulaDiv.innerHTML = formula;
  document.getElementById("result").classList.remove("hidden");

  // Force MathJax to typeset dynamically inserted math
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
  document.getElementById("formula").innerHTML = "";
}
