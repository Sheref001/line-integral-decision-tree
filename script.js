console.log("script.js loaded");

/* ================================================================
   STATE
   ================================================================ */
const State = {
  curve: null,     // "plane" | "space"
  field: null,     // "scalar" | "vector"
  strategy: null,  // "ds" | "dxdy" | "dxdydz" | "dxyz"
  strategyLabel: null,
  mode: "student"
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

function setGuideText(text) {
  const guide = $("guide-text");
  if (guide) guide.textContent = text;
}

function setProgress(step) {
  const map = $("progress-map");
  if (!map) return;
  map.querySelectorAll("li").forEach((li) => {
    const key = li.getAttribute("data-step");
    li.classList.remove("active", "done");
    if (key === step) {
      li.classList.add("active");
    } else if (
      (step === "field" && key === "curve") ||
      (step === "strategy" && (key === "curve" || key === "field")) ||
      (step === "result" && key !== "result")
    ) {
      li.classList.add("done");
    }
  });
}

function renderExample() {
  const card = $("example-card");
  if (!card) return;

  if (!State.curve) {
    card.textContent = "Make a selection to see a worked example.";
    return;
  }

  const key = `${State.curve}-${State.field || "?"}-${State.strategy || "?"}`;
  const examples = {
    "plane-scalar-ds": `
      <b>Example:</b> Let C be x=t, y=t^2, 0≤t≤1 and f(x,y)=x+y. <br>
      Then \\(\\int_C f\\,ds = \\int_0^1 (t+t^2)\\sqrt{1+(2t)^2}\\,dt\\).
    `,
    "plane-scalar-dxdy": `
      <b>Example:</b> Let C be x=t, y=\\sin t, 0≤t≤\\pi and f(x,y)=xy. <br>
      Then \\(\\int_C f\\,dx = \\int_0^\\pi (t\\sin t)\\,dt\\).
    `,
    "plane-vector-dxdy": `
      <b>Example:</b> \\(\\mathbf{F}=(y, x^2)\\), C: x=t, y=t^2. <br>
      Then \\(\\int_C \\mathbf{F}\\cdot d\\mathbf{r}=\\int (y\\,dx + x^2\\,dy)\\).
    `,
    "space-scalar-ds": `
      <b>Example:</b> C: (t, t^2, t^3), 0≤t≤1 and f=x+z. <br>
      Then \\(\\int_C f\\,ds=\\int_0^1 (t+t^3)\\sqrt{1+4t^2+9t^4}\\,dt\\).
    `,
    "space-scalar-dxdydz": `
      <b>Example:</b> C: (\\cos t, \\sin t, t), 0≤t≤2\\pi and f=xz. <br>
      Then \\(\\int_C f\\,dx=\\int_0^{2\\pi} (\\cos t\\, t)(-\\sin t)\\,dt\\).
    `,
    "space-vector-dxyz": `
      <b>Example:</b> \\(\\mathbf{F}=(yz, xz, xy)\\), C: (t, t^2, t^3). <br>
      Then \\(\\int_C \\mathbf{F}\\cdot d\\mathbf{r}=\\int (P\\,dx+Q\\,dy+R\\,dz)\\).
    `,
  };

  const html = examples[key] || "Complete the choices to see a worked example.";
  card.innerHTML = html;
  renderMath([card]);
}

function setMode(mode) {
  State.mode = mode;
}

/* ================================================================
   STEP 1 — Curve
   ================================================================ */
function renderCurveStep() {
  clear($("step-curve"));
  $("step-curve").classList.add("active");
  $("step-field").classList.add("hidden");
  $("step-method").classList.add("hidden");
  setProgress("curve");
  setGuideText("Start by choosing whether the curve lies in the plane or in space.");

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
  setProgress("field");
  setGuideText("Decide whether you are integrating a scalar field or a vector field.");

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
  setProgress("strategy");
  setGuideText("Choose between arc length (ds) or coordinate form (dx, dy, dz).");

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
  setProgress("result");
  setGuideText("Review the formula and compare with the worked example below.");

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
    explanation = State.mode === "instructor" ? `
    <b>Special case (natural parametrization):</b><br>
    If \\[y=g(x)\\], then
    \\[
    \\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx
    \\]
    ` : "";
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
    explanation = State.mode === "instructor" ? `
      Similar formulas apply for \\(\\int_C f(x,y)\\,dy\\).
    ` : "";
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
    explanation = State.mode === "instructor" ? `
      This reduces to scalar line integrals of the components.
    ` : "";
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
    explanation = State.mode === "instructor" ? "Use arc length when you need geometry of the curve." : "";
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
    explanation = State.mode === "instructor" ? "Choose dx/dy/dz if the problem presents coordinate parametrization." : "";
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
    explanation = State.mode === "instructor" ? `
      This reduces to scalar line integrals in \\(x,y,z\\).
    ` : "";
  }

  f.innerHTML = formula;
  e.innerHTML = explanation;
  renderMath([f, e]);
  renderExample();
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
      renderExample();
    };
  }
  const modeSelect = $("mode-select");
  if (modeSelect) {
    modeSelect.onchange = (e) => {
      setMode(e.target.value);
      if (State.strategy) showResult();
    };
  }

  const smartInput = $("smart-input");
  const smartApply = $("smart-apply");
  const smartFeedback = $("smart-feedback");
  function applySmartSearch() {
    if (!smartInput) return;
    const q = smartInput.value.toLowerCase();
    resetState();
    if (q.includes("plane") || q.includes("r2")) State.curve = "plane";
    if (q.includes("space") || q.includes("r3")) State.curve = "space";
    if (q.includes("scalar")) State.field = "scalar";
    if (q.includes("vector")) State.field = "vector";
    if (q.includes("ds") || q.includes("arc")) State.strategy = "ds";
    if (q.includes("dx dy") || q.includes("dxdy")) State.strategy = "dxdy";
    if (q.includes("dx dy dz") || q.includes("dxdydz") || q.includes("dx dz") || q.includes("dy dz")) State.strategy = "dxdydz";
    if (q.includes("dot") || q.includes("f·dr") || q.includes("dr")) State.strategy = "dxyz";

    if (!State.curve) State.curve = "plane";
    if (!State.field) State.field = "scalar";

    renderCurveStep();
    breadcrumbs();
    renderFieldStep();
    if (State.strategy) {
      renderStrategyStep();
      showResult();
      if (smartFeedback) smartFeedback.textContent = "Applied your description to a decision path.";
    } else {
      if (smartFeedback) smartFeedback.textContent = "We set curve and field. Choose the final strategy.";
    }
  }
  if (smartApply) smartApply.onclick = applySmartSearch;
  if (smartInput) {
    smartInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applySmartSearch();
    });
  }
  renderCurveStep();
  breadcrumbs();
  renderExample();
});
