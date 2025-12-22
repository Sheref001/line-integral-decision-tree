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

  const stepMethod = document.getElementById("step-method");

  // Hide method step and all buttons first
  stepMethod.classList.add("hidden");
  document.getElementById("btn-ds").classList.add("hidden");
  document.getElementById("btn-dxdy").classList.add("hidden");
  document.getElementById("btn-dxyz").classList.add("hidden");

  // -------------------------------
  // Plane curve
  // -------------------------------
  if (curveType === "plane") {

    // Plane + scalar: ds OR dx, dy
    if (fieldType === "scalar") {
      stepMethod.classList.remove("hidden");
      document.getElementById("btn-ds").classList.remove("hidden");
      document.getElementById("btn-dxdy").classList.remove("hidden");
    }

    // Plane + vector: direct result (dx, dy)
    if (fieldType === "vector") {
      methodType = "coord";
      showResult();
    }
  }

  // -------------------------------
  // Space curve
  // -------------------------------
  if (curveType === "space") {

    // Space + scalar: ds OR dx, dy, dz
    if (fieldType === "scalar") {
      stepMethod.classList.remove("hidden");
      document.getElementById("btn-ds").classList.remove("hidden");
      document.getElementById("btn-dxyz").classList.remove("hidden");
    }

    // Space + vector: dx, dy, dz
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
// Result logic (unchanged)
// ------------------------------------------------
function showResult() {
  const formulaDiv = document.getElementById("formula");
  const explanationDiv = document.getElementById("explanation");
  const naturalDiv = document.getElementById("natural-param");

  let formula = "";
  let explanationHTML = "";

  naturalDiv.classList.add("hidden");
  naturalDiv.innerHTML = "";

  // Plane scalar — ds
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int\limits_C f(x,y)\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x')^2+(y')^2}\\,dt$$
    `;
    explanationHTML = `Scalar accumulation along a plane curve.`;

    naturalDiv.innerHTML = `
      <b>Special case: natural parametrization</b><br><br>
      $$y=g(x):\\; \\int f(x,g(x))\\sqrt{1+(g')^2}\\,dx$$
      $$x=h(y):\\; \\int f(h(y),y)\\sqrt{1+(h')^2}\\,dy$$
    `;
    naturalDiv.classList.remove("hidden");
  }

  // Plane scalar — dx, dy
  if (
    curveType === "plane" &&
    fieldType === "scalar" &&
    methodType === "dxdy"
  ) {
    formula = `
    $$\\int\limits_C f(x,y)\\,dx = \\int f(x(t),y(t))x'(t)dt$$
    $$\\int\limits_C f(x,y)\\,dy = \\int f(x(t),y(t))y'(t)dt$$
    `;
    explanationHTML = `Scalar line integrals via coordinate differentials.`;
  }

  // Plane vector
  if (curveType === "plane" && fieldType === "vector") {
    formula = `
    $$\\int\limits_C P\\,dx+Q\\,dy
    =
    \\int_a^b (Px'+Qy')dt$$
    `;
    explanationHTML = `Work integral in the plane.`;
  }

  // Space scalar — ds
  if (curveType === "space" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int\limits_C f(x,y,z)\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}dt$$
    `;
    explanationHTML = `Standard scalar line integral in space.`;
  }

  // Space scalar — dx, dy, dz
  if (curveType === "space" && fieldType === "scalar" && methodType === "dxyz") {
    formula = `
    $$\\int\limits_C f\\,dx = \\int f x' dt$$
    $$\\int\limits_C f\\,dy = \\int f y' dt$$
    $$\\int\limits_C f\\,dz = \\int f z' dt$$
    `;
    explanationHTML = `Coordinate-based scalar integrals in space.`;
  }

  // Space vector
  if (curveType === "space" && fieldType === "vector" && methodType === "dxyz") {
    formula = `
    $$\\int\limits_C P\\,dx+Q\\,dy+R\\,dz
    =
    \\int_a^b (Px'+Qy'+Rz')dt$$
    `;
    explanationHTML = `Work integral in space.`;
  }

  formulaDiv.innerHTML = formula;
  explanationDiv.innerHTML = explanationHTML;
  document.getElementById("result").classList.remove("hidden");

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
