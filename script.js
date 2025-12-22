function showResult() {
  const formulaDiv = document.getElementById("formula");
  let formula = "";

  if (curveType === "plane" && fieldType === "scalar" && methodType === "ds") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t))\\sqrt{(x')^2+(y')^2}\\,dt$$`;
  }

  if (curveType === "plane" && fieldType === "scalar" && methodType === "coord") {
    formula = `
    $$\\int_C f\\,dx
    \\quad \\text{or} \\quad
    \\int_C f\\,dy$$`;
  }

  if (curveType === "plane" && fieldType === "vector") {
    formula = `
    $$\\int_C P\\,dx + Q\\,dy
    =
    \\int_a^b (P x' + Q y')\\,dt$$`;
  }

  if (curveType === "space" && fieldType === "scalar") {
    formula = `
    $$\\int_C f\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt$$`;
  }

  if (curveType === "space" && fieldType === "vector") {
    formula = `
    $$\\int_C P\\,dx + Q\\,dy + R\\,dz
    =
    \\int_a^b (P x' + Q y' + R z')\\,dt$$`;
  }

  formulaDiv.innerHTML = formula;
  document.getElementById("result").classList.remove("hidden");

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}
