console.log("script.js loaded");

/* ================================================================
   STATE
   ================================================================ */
const State = {
  curve: null,     // "plane" | "space"
  field: null,     // "scalar" | "vector"
  strategy: null   // "ds" | "dxdy" | "dxdydz" | "dxyz"
};

function resetState() {
  State.curve = null;
  State.field = null;
  State.strategy = null;
}

/* ================================================================
   DOM HELPERS
   ================================================================ */
function $(id) {
  return document.getElementById(id);
}

function clear(el) {
  el.innerHTML = "";
}

function button(label, action) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = "choice";
  b.onclick = action;
  return b;
}

/* ================================================================
   MATHJAX SAFE RENDER
   ================================================================ */
function renderMath(nodes) {
  if (!window.MathJax || !MathJax.typesetPromise) return;
  MathJax.typesetClear(nodes);
  MathJax.typesetPromise(nodes);
}

/* ================================================================
   BREADCRUMBS
   ================================================================ */
function breadcrumbs() {
  const bc = $("breadcrumbs");
  if (!bc) return;
  bc.innerHTML = "";

  const parts = [];
  if (State.curve) parts.push(State.curve === "plane" ? "Plane curve ℝ²" : "Space curve ℝ³");
  if (State.field) parts.push(State.field === "scalar" ? "Scalar field" : "Vector field");
  if (State.strategy) parts.push(State.strategyLabel);

  bc.textContent = parts.join(" → ");
}

/* ================================================================
   STEP 1 — Curve
   ================================================================ */
function renderCurveStep() {
  clear($("step-curve"));

  $("step-curve").appendChild(
    button("Plane Curve ℝ²", () => {
      resetState();
      State.curve = "plane";
      breadcrumbs();
      renderFieldStep();
    })
  );

  $("step-curve").appendChild(
    button("Space Curve ℝ³", () => {
      resetState();
      State.curve = "space";
      breadcrumbs();
      renderFieldStep();
    })
  );
}

/* ================================================================
   STEP 2 — Field
   ================================================================ */
function renderFieldStep() {
  clear($("step-field"));
  $("step-field").classList.remove("hidden");

  $("step-field").appendChild(
    button("Scalar Field", () => {
      State.field = "scalar";
      breadcrumbs();
      renderStrategyStep();
    })
  );

  $("step-field").appendChild(
    button("Vector Field", () => {
      State.field = "vector";
      breadcrumbs();
      renderStrategyStep();
    })
  );
}

/* ================================================================
   STEP 3 — Strategy (matches TikZ exactly)
   ================================================================ */
function renderStrategyStep() {
  clear($("step-method"));
  $("step-method").classList.remove("hidden");

  /* ---------------- Plane + Scalar ---------------- */
  if (State.curve === "plane" && State.field === "scalar") {
    $("step-method").appendChild(
      button("Integrate w.r.t. arc length (ds)", () => {
        State.strategy = "ds";
        State.strategyLabel = "Arc length";
        breadcrumbs();
        showResult();
      })
    );

    $("step-method").appendChild(
      button("Integrate w.r.t. x or y", () => {
        State.strategy = "dxdy";
        State.strategyLabel = "dx / dy";
        breadcrumbs();
        showResult();
      })
    );
  }

  /* ---------------- Plane + Vector (forced) ---------------- */
  if (State.curve === "plane" && State.field === "vector") {
    State.strategy = "dxdy";
    State.strategyLabel = "dx, dy";
    breadcrumbs();
    showResult();
  }

  /* ---------------- Space + Scalar ---------------- */
  if (State.curve === "space" && State.field === "scalar") {
    $("step-method").appendChild(
      button("Integrate w.r.t. arc length (ds)", () => {
        State.strategy = "ds";
        State.strategyLabel = "Arc length";
        breadcrumbs();
        showResult();
      })
    );

    $("step-method").appendChild(
      button("Integrate w.r.t. x, y, or z", () => {
        State.strategy = "dxdydz";
        State.strategyLabel = "dx / dy / dz";
        breadcrumbs();
        showResult();
      })
    );
  }

  /* ---------------- Space + Vector (forced) ---------------- */
  if (State.curve === "space" && State.field === "vector") {
    State.strategy = "dxyz";
    State.strategyLabel = "dx, dy, dz";
    breadcrumbs();
    showResult();
  }
}

/* ================================================================
   FINAL FORMULAS (copied from TikZ)
   ================================================================ */
function showResult() {
  const f = $("formula");
  const e = $("explanation");
  $("result").classList.remove("hidden");

  let formula = "";
  let explanation = "";

  /* Plane scalar ds */
  if (State.curve === "plane" && State.field === "scalar" && State.strategy === "ds") {
    formula = `
    \\[
    \\int_C f(x,y)\\,ds
    =
    \\int_a^b f(x(t),y(t))
    \\sqrt{(x'(t))^2+(y'(t))^2}\\,dt
    \\]
    `;
    explanation = `
    <b>Special case (natural parametrization):</b><br>
    If \\[y=g(x)\\]:
    \\[
    \\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx
    \\]
    `;
  }

  /* Plane scalar dx/dy */
  if (State.curve === "plane" && State.field === "scalar" && State.strategy === "dxdy") {
    formula = `
    \\[
    \\int_C f(x,y)\\,dx
    =
    \\int_a^b f(x(t),y(t))x'(t)\\,dt
    \\]
    `;
    explanation = `
    Similar formulas apply for $\\int_C f(x,y)\\,dy$.
    `;
  }

  /* Plane vector */
  if (State.curve === "plane" && State.field === "vector") {
    formula = `
    \\[
    \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C (P\\,dx + Q\\,dy)
    \\]
    `;
    explanation = `
    This reduces to scalar line integrals of the components.
    `;
  }

  /* Space scalar ds */
  if (State.curve === "space" && State.field === "scalar" && State.strategy === "ds") {
    formula = `
    \\[
    \\int_C f(x,y,z)\\,ds
    =
    \\int_a^b f(x(t),y(t),z(t))
    \\sqrt{(x')^2+(y')^2+(z')^2}\\,dt
    \\]
    `;
  }

  /* Space scalar dx/dy/dz */
  if (State.curve === "space" && State.field === "scalar" && State.strategy === "dxdydz") {
    formula = `
    \\[
    \\int_C f(x,y,z)\\,dx
    =
    \\int_a^b f(x(t),y(t),z(t))x'(t)\\,dt
    \\]
    `;
  }

  /* Space vector */
  if (State.curve === "space" && State.field === "vector") {
    formula = `
    \\[
    \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C (P\\,dx+Q\\,dy+R\\,dz)
    \\]
    `;
    explanation = `
    This reduces to scalar line integrals in \\(x,y,z\\).
    `;
  }

  f.innerHTML = formula;
  e.innerHTML = explanation;
  renderMath([f, e]);
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderCurveStep();
});
