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

  stepMethod.classList.add("hidden");
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
// Result logic (MathJax-safe)
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
\\[
\\int_C f(x,y)\\,ds
=
\\int_a^b f(x(t),y(t))
\\sqrt{
  \\left(\\frac{dx}{dt}\\right)^2
  +
  \\left(\\frac{dy}{dt}\\right)^2
}\\,dt
\\]
    `;
    explanationHTML = `Scalar accumulation along a plane curve.`;

    naturalDiv.innerHTML = `
<b>Special case: natural parametrization</b><br><br>
\\[
y=g(x):\\quad
\\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx
\\]
\\[
x=h(y):\\quad
\\int_a^b f(h(y),y)\\sqrt{1+(h'(y))^2}\\,dy
\\]
    `;
    naturalDiv.classList.remove("hidden");
  }

  // Plane scalar — dx, dy
  if (curveType === "plane" && fieldType === "scalar" && methodType === "dxdy") {
    formula = `
\\[
\\int_C f(x,y)\\,dx
=
\\int_a^b f(x(t),y(t))\\frac{dx}{dt}\\,dt
\\]
\\[
\\int_C f(x,y)\\,dy
=
\\int_a^b f(x(t),y(t))\\frac{dy}{dt}\\,dt
\\]
    `;
    explanationHTML = `Scalar line integrals via coordinate differentials.`;
  }

  // Plane vector
  if (curveType === "plane" && fieldType === "vector") {
    formula = `
\\[
\\int_C \\bigl(P(x,y)\\,dx + Q(x,y)\\,dy\\bigr)
=
\\int_a^b
\\bigl(
P(x(t),y(t))\\frac{dx}{dt}
+
Q(x(t),y(t))\\frac{dy}{dt}
\\bigr)\\,dt
\\]
    `;
    explanationHTML = `Work integral in the plane.`;
  }

  // Space scalar — ds
  if (curveType === "space" && fieldType === "scalar" && methodType === "ds") {
    formula = `
\\[
\\int_C f(x,y,z)\\,ds
=
\\int_a^b f(x(t),y(t),z(t))
\\sqrt{
  \\left(\\frac{dx}{dt}\\right)^2
  +
  \\left(\\frac{dy}{dt}\\right)^2
  +
  \\left(\\frac{dz}{dt}\\right)^2
}\\,dt
\\]
    `;
    explanationHTML = `Standard scalar line integral in space.`;
  }

  // Space scalar — dx, dy, dz
  if (curveType === "space" && fieldType === "scalar" && methodType === "dxyz") {
    formula = `
\\[
\\int_C f(x,y,z)\\,dx
=
\\int_a^b f(x(t),y(t),z(t))\\frac{dx}{dt}\\,dt
\\]
\\[
\\int_C f(x,y,z)\\,dy
=
\\int_a^b f(x(t),y(t),z(t))\\frac{dy}{dt}\\,dt
\\]
\\[
\\int_C f(x,y,z)\\,dz
=
\\int_a^b f(x(t),y(t),z(t))\\frac{dz}{dt}\\,dt
\\]
    `;
    explanationHTML = `Coordinate-based scalar integrals in space.`;
  }

  // Space vector
  if (curveType === "space" && fieldType === "vector" && methodType === "dxyz") {
    formula = `
\\[
\\int_C \\bigl(P\\,dx + Q\\,dy + R\\,dz\\bigr)
=
\\int_a^b
\\bigl(
P\\frac{dx}{dt}
+
Q\\frac{dy}{dt}
+
R\\frac{dz}{dt}
\\bigr)\\,dt
\\]
    `;
    explanationHTML = `Work integral in space.`;
  }

  formulaDiv.innerHTML = formula;
  explanationDiv.innerHTML = explanationHTML;
  document.getElementById("result").classList.remove("hidden");

  if (window.MathJax) {
    MathJax.typesetPromise([formulaDiv, naturalDiv, explanationDiv]);
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
