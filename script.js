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

  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = "∫C f ds = ∫ f(x(t),y(t)) √[(x')²+(y')²] dt";
  }

  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = "∫C f dx or ∫C f dy";
  }

  if (curveType === "plane" && fieldType === "vector") {
    formula = "∫C P dx + Q dy";
  }

  if (curveType === "space" && fieldType === "scalar") {
    formula = "∫C f ds = ∫ f(x(t),y(t),z(t)) √[(x')²+(y')²+(z')²] dt";
  }

  if (curveType === "space" && fieldType === "vector") {
    formula = "∫C P dx + Q dy + R dz";
  }

  formulaDiv.textContent = formula;
  document.getElementById("result").classList.remove("hidden");
}

function resetTree() {
  curveType = fieldType = methodType = "";
  document.querySelectorAll(".step").forEach(step => step.classList.add("hidden"));
  document.getElementById("step-curve").classList.remove("hidden");
}
