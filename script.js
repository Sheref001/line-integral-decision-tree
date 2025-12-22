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

  // Hide method step by default
  document.getElementById("step-method").classList.add("hidden");

  // Plane scalar: method choice
  if (fieldType === "scalar" && curveType === "plane") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Space vector: method choice (ds vs dx dy dz)
  if (fieldType === "vector" && curveType === "space") {
    document.getElementById("step-method").classList.remove("hidden");
  }

  // Plane vector OR space scalar: go directly to result
  if (
    (fieldType === "vector" && curveType === "plane") ||
    (fieldType === "scalar" && curveType === "space")
  ) {
    methodType = "ds";
    showResult();
  }
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

// ------------------------------------------------
// Result logic
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
      This integral accumulates the scalar field
      <span class="math">\\(f(x,y)\\)</span>
      along the curve itself. The element
      <span class="math">\\(ds\\)</span>
      accounts for the geometry of the path.
    `;

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
      These formulas follow from parametrizing the curve as
      <span class="math">\\(x=x(t),\\;y=y(t)\\)</span>
      and rewriting the coordinate differentials
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
  // Space curve — scalar field — arc length
  // =================================================
  if (curveType === "space" && fieldType === "scalar") {
    formula = `
    $$\\int_C f(x,y,z)\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{\\left(\\frac{dx}{dt}\\right)^2
          +\\left(\\frac{dy}{dt}\\right)^2
          +\\left(\\frac{dz}{dt}\\right)^2}\\,dt$$
    `;
    explanationHTML = `
      For space curves, scalar line integrals are almost always computed
      using a parametrization. Unlike plane curves, space curves are
      rarely described as graphs of functions.
    `;
  }

  // =================================================
  // Space curve — vector field — dx dy dz
  // =================================================
  if (
    curveType === "space" &&
    fieldType === "vector" &&
    (methodType === "dxyz" || methodType === "coord")
  ) {
    formula = `
    $$\\int_C P(x,y,z)\\,dx + Q(x,y,z)\\,dy + R(x,y,z)\\,dz
    =
    \\int_a^b \\Big(
      P(x(t),y(t),z(t))\\,x'(t)
      + Q(x(t),y(t),z(t))\\,y'(t)
      + R(x(t),y(t),z(t))\\,z'(t)
    \\Big)dt$$
    `;
    explanationHTML = `
      This is the work integral of a vector field along a space curve,
      computed using coordinate differentials.
    `;
  }

  // Inject content
  formulaDiv.innerHTML = formula;
  explanationDiv.innerHTML = explanationHTML;
  document.getElementById("result").classList.remove("hidden");

  // MathJax re-render
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
