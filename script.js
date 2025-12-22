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

  document.getElementById("step-method").classList.add("hidden");

  // Scalar fields: method choice only meaningful in the plane
  if (fieldType === "scalar" && curveType === "plane") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Vector fields OR space scalar fields: go directly to result
  if (fieldType === "vector" || (fieldType === "scalar" && curveType === "space")) {
    methodType = "ds"; // force correct behavior
    showResult();
  }
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

// ------------------------------------------------
// Result logic (TikZ-faithful + pedagogically correct)
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");

  let formula = "";
  let explanationHTML = "";

  naturalDiv.classList.add("hidden");
  naturalDiv.innerHTML = "";

  // =================================================
  // Plane curve — scalar field — arc length
  // =================================================
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y)\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{\\left(\\frac{dx}{dt}\\right)^2
          +\\left(\\frac{dy}{dt}\\right)^2}\\,dt$$
    `;
    explanationHTML = `
      This integral measures the accumulation of the scalar field
      <span class="math">\\(f(x,y)\\)</span>
      along the curve itself. The element
      <span class="math">\\(ds\\)</span>
      accounts for the geometry of the path.
    `;

    // Natural parametrization (plane only)
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

  // =================================================
  // Plane curve — scalar field — dx / dy
  // =================================================
  if (
    curveType === "plane" &&
    fieldType === "scalar" &&
    (methodType === "dxdy" || methodType === "coord")
  ) {
    formula = `
    $$\\begin{aligned}
    \\int_C f(x,y)\\,dx
    &= \\int_a^b f(x(t),y(t))\\frac{dx}{dt}\\,dt,\\\\[6pt]
    \\int_C f(x,y)\\,dy
    &= \\int_a^b f(x(t),y(t))\\frac{dy}{dt}\\,dt
    \\end{aligned}$$
    `;
    explanationHTML = `
      These formulas are obtained by parametrizing the curve
      <span class="math">\\(x=x(t),\\;y=y(t)\\)</span>
      and expressing the coordinate differentials
      <span class="math">\\(dx,dy\\)</span>
      in terms of
      <span class="math">\\(dt\\)</span>.
    `;
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
    explanationHTML = `
      This line integral represents the work done by the vector field
      <span class="math">\\(\\langle P,Q \\rangle\\)</span>
      along the plane curve.
    `;
  }

  // =================================================
  // Space curve — scalar field (PARAMETRIC ONLY)
  // =================================================
  if (curveType === "space" && fieldType === "scalar" && && methodType === "ds") {
    formula = `
    $$\\int_C f(x,y,z)\\,ds
    =
    \\int_a^b
    f(x(t),y(t),z(t))
    \\sqrt{\\left(\\frac{dx}{dt}\\right)^2
          +\\left(\\frac{dy}{dt}\\right)^2
          +\\left(\\frac{dz}{dt}\\right)^2}\\,dt$$
    `;
    explanationHTML = `
      For space curves, scalar line integrals are almost always computed
      using a parametrization.
      Unlike plane curves, space curves are rarely described as graphs
      of functions.
    `;
  }

  // =================================================
  // Space curve — scalar field (PARAMETRIC ONLY)
  // =================================================
  if (curveType === "space" && fieldType === "scalar" &&(methodType === "dxdydz" || methodType === "coord")
  )) {
    formula = `
    $$\\int_C f(x,y,z)\\,ds
    =
    \\int_a^b
    f(x(t),y(t),z(t))
    \\sqrt{\\left(\\frac{dx}{dt}\\right)^2
          +\\left(\\frac{dy}{dt}\\right)^2
          +\\left(\\frac{dz}{dt}\\right)^2}\\,dt$$
    `;
    explanationHTML = `
      For space curves, scalar line integrals are almost always computed
      using a parametrization.
      Unlike plane curves, space curves are rarely described as graphs
      of functions.
    `;
  }

  // =================================================
  // Space curve — vector field
  // =================================================
  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$
    `;
    explanationHTML = `
      This line integral represents the work done by the vector field
      <span class="math">\\(\\langle P,Q,R \\rangle\\)</span>
      along the space curve.
    `;
  }

  // Inject content
  formulaDiv.innerHTML = formula;
  explanationDiv.innerHTML = explanationHTML;
  document.getElementById("result").classList.remove("hidden");

  // MathJax render
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
