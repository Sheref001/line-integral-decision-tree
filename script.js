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
  methodType = "";
  hideAllSteps();
  resetResult();
  document.getElementById("step-field").classList.remove("hidden");
}

function chooseField(type) {
  fieldType = type;
  methodType = "";

  const stepMethod = document.getElementById("step-method");

  stepMethod.classList.add("hidden");
  resetResult();
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
@@ -194,32 +198,38 @@ R\\frac{dz}{dt}

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
  resetResult();
  document.getElementById("step-curve").classList.remove("hidden");
}

function resetResult() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("formula").innerHTML = "";
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("natural-param").innerHTML = "";
  document.getElementById("natural-param").classList.add("hidden");

  const naturalDiv = document.getElementById("natural-param");
  naturalDiv.innerHTML = "";
  naturalDiv.classList.add("hidden");
}
