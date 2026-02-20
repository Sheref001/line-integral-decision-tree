console.log("script.js loaded");

/* ================================================================
   STATE
   ================================================================ */
const State = {
  curve: null,     // "plane" | "space"
  field: null,     // "scalar" | "vector"
  strategy: null,  // "ds" | "dxdy" | "dxdydz" | "dxyz"
  strategyLabel: null
};

function resetState() {
  State.curve = null;
  State.field = null;
  State.strategy = null;
  State.strategyLabel = null;
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

  bc.textContent = parts.length ? parts.join(" → ") : "Start by choosing the curve type.";
}

/* ================================================================
   STEP 1 — Curve
   ================================================================ */
function renderCurveStep() {
  clear($("step-curve"));
  $("step-curve").classList.add("active");
  $("step-field").classList.add("hidden");
  $("step-method").classList.add("hidden");

  const title = document.createElement("h2");
  title.textContent = "Step 1 — What kind of curve is C?";
  $("step-curve").appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = "Choose whether the path lies in the plane or in space.";
  $("step-curve").appendChild(desc);

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
  $("step-field").classList.add("active");
  $("step-curve").classList.remove("active");
  $("step-curve").classList.add("completed");

  const title = document.createElement("h2");
  title.textContent = "Step 2 — What type of field?";
  $("step-field").appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = "Scalar fields integrate a function; vector fields integrate a dot product.";
  $("step-field").appendChild(desc);

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
  $("step-method").classList.add("active");
  $("step-field").classList.remove("active");
  $("step-field").classList.add("completed");

  const title = document.createElement("h2");
  title.textContent = "Step 3 — Choose the integration form";
  $("step-method").appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = "Pick the form that matches the information given in the problem.";
  $("step-method").appendChild(desc);

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
    If \\[y=g(x)\\], then
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
   Similar formulas apply for \\(\\int_C f(x,y)\\,dy\\).
    `;
  }

  /* Plane vector */
  if (State.curve === "plane" && State.field === "vector") {
    formula = `
    \\[
    \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
    =
    \\int_C (P(x,y)\\,dx + Q(x,y)\\,dy)
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
    \\int_C (P(x,y,z)\\,dx+Q(x,y,z)\\,dy+R(x,y,z)\\,dz)
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
  const resetBtn = $("reset-btn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      resetState();
      $("result").classList.add("hidden");
      renderCurveStep();
      breadcrumbs();
    };
  }
  renderCurveStep();
  breadcrumbs();
});
