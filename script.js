let curveType = "";
let fieldType = "";
let methodType = "";

function chooseCurve(type) {
  curveType = type;
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;
  document.getElementById("step-method").classList.remove("hidden");
}

function chooseMethod(type) {
  methodType = type;
  showResult();
}

function showResult() {
  const formulaDiv = document.getElementById("formula");
  let formula = "";

  // Plane curve + scalar field + arc length
  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x')^2+(y')^2}\\,dt$$
    `;
  }

  // Plane curve + scalar field + coordinate
  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = `
    $$\\int_C f\\,dx
    \\quad \\text{or} \\quad
    \\int_C f\\,dy$$
    `;
  }

  // Plane curve + vector field
  if (curveType === "plane" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy
    =
    \\int_a^b (P x' + Q y')\\,dt$$
    `;
  }

  // Space curve + scalar field
  if (curveType === "space" && fieldType === "scalar") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt$$
    `;
  }

  // Space curve + vector field
  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$
    `;
  }

  formulaDiv.innerHTML = formula;
  document.getElementById("result").classList.remove("hidden");

  // Tell MathJax to typeset the new content
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

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
