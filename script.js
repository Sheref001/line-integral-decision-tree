// ================================================================
// STATE
// ================================================================
const State = {
  curve: null,
  field: null,
  method: null
};

function resetState() {
  State.curve = null;
  State.field = null;
  State.method = null;
}

// ================================================================
// DECISION TABLE (single source of truth)
// ================================================================
const DecisionTable = {
  plane: {
    label: "Plane curve",
    scalar: {
      label: "Scalar field",
      methods: {
        ds: {
          label: "Arc length (ds)",
          formula: `\\[ \\int_C f(x,y)\\, ds \\]`,
          explanation: "Scalar field integrated along a plane curve using arc length."
        },
        dxdy: {
          label: "Cartesian (dx, dy)",
          formula: `\\[ \\int_C f(x,y)\\,dx + g(x,y)\\,dy \\]`,
          explanation: "Curve given in Cartesian form."
        }
      }
    },
    vector: {
      label: "Vector field",
      methods: {
        coord: {
          label: "Work integral",
          formula: `\\[
            \\int_C \\mathbf{F}\\cdot d\\mathbf{r}
            = \\int_C P\\,dx + Q\\,dy
          \\]`,
          explanation: "Work done by a planar vector field."
        }
      }
    }
  },

  space: {
    label: "Space curve",
    scalar: {
      label: "Scalar field",
      methods: {
        ds: {
          label: "Arc length (ds)",
          formula: `\\[ \\int_C f(x,y,z)\\, ds \\]`,
          explanation: "Scalar field integrated along a space curve."
        },
        dxyz: {
          label: "Parametric",
          formula: `\\[
            \\int_C f(x,y,z)
            \\left| \\frac{d\\mathbf{r}}{dt} \\right| dt
          \\]`,
          explanation: "Curve given parametrically."
        }
      }
    },
    vector: {
      label: "Vector field",
      methods: {
        dxyz: {
          label: "Work integral",
          formula: `\\[ \\int_C \\mathbf{F}\\cdot d\\mathbf{r} \\]`,
          explanation: "Work done by a vector field in space."
        }
      }
    }
  }
};

// ================================================================
// DOM UTILITIES
// ================================================================
function $(id) {
  return document.getElementById(id);
}

function clear(el) {
  el.innerHTML = "";
}

function button(text, onclick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "choice";
  btn.onclick = onclick;
  return btn;
}

// ================================================================
// MATHJAX SAFE RENDER
// ================================================================
function renderMath(elements) {
  if (!window.MathJax || !MathJax.typesetPromise) return;

  MathJax.typesetClear(elements);
  MathJax.typesetPromise(elements).catch(err =>
    console.error("MathJax error:", err)
  );
}

// ================================================================
// BREADCRUMBS
// ================================================================
function getBreadcrumbs() {
  const crumbs = [];

  if (State.curve)
    crumbs.push(DecisionTable[State.curve].label);

  if (State.field)
    crumbs.push(DecisionTable[State.curve][State.field].label);

  if (State.method)
    crumbs.push(
      DecisionTable[State.curve]
        [State.field]
        .methods[State.method].label
    );

  return crumbs;
}

function renderBreadcrumbs() {
  const container = $("breadcrumbs");
  container.innerHTML = "";

  getBreadcrumbs().forEach((c, i, arr) => {
    container.appendChild(document.createTextNode(c));
    if (i < arr.length - 1)
      container.appendChild(document.createTextNode(" → "));
  });
}

// ================================================================
// URL SYNC
// ================================================================
function updateURL() {
  const p = new URLSearchParams();
  if (State.curve) p.set("curve", State.curve);
  if (State.field) p.set("field", State.field);
  if (State.method) p.set("method", State.method);

  history.replaceState(null, "", "?" + p.toString());
}

function loadStateFromURL() {
  const p = new URLSearchParams(window.location.search);
  if (p.get("curve")) State.curve = p.get("curve");
  if (p.get("field")) State.field = p.get("field");
  if (p.get("method")) State.method = p.get("method");
}

// ================================================================
// UI RENDERERS
// ================================================================
function renderCurveStep() {
  const c = $("step-curve");
  clear(c);

  Object.entries(DecisionTable).forEach(([k, v]) => {
    c.appendChild(
      button(v.label, () => {
        resetState();
        State.curve = k;
        updateURL();
        renderBreadcrumbs();
        renderFieldStep();
      })
    );
  });
}

function renderFieldStep() {
  const c = $("step-field");
  clear(c);
  c.classList.remove("hidden");

  Object.entries(DecisionTable[State.curve]).forEach(([k, v]) => {
    if (k === "label") return;

    c.appendChild(
      button(v.label, () => {
        State.field = k;
        State.method = null;
        updateURL();
        renderBreadcrumbs();
        renderMethodStep();
      })
    );
  });
}

function renderMethodStep() {
  const c = $("step-method");
  clear(c);
  c.classList.remove("hidden");

  const methods =
    DecisionTable[State.curve][State.field].methods;

  const keys = Object.keys(methods);

  if (keys.length === 1) {
    State.method = keys[0];
    updateURL();
    renderBreadcrumbs();
    showResult();
    return;
  }

  keys.forEach(k => {
    c.appendChild(
      button(methods[k].label, () => {
        State.method = k;
        updateURL();
        renderBreadcrumbs();
        showResult();
      })
    );
  });
}

// ================================================================
// RESULT
// ================================================================
function showResult() {
  const node =
    DecisionTable[State.curve]
      [State.field]
      .methods[State.method];

  $("formula").innerHTML = node.formula;
  $("explanation").innerHTML = node.explanation;
  $("result").classList.remove("hidden");

  renderMath([$(
    "formula"
  ), $("explanation")]);
}

// ================================================================
// INIT
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
  resetState();
  loadStateFromURL();

  renderCurveStep();
  renderBreadcrumbs();

  if (State.curve && State.field) renderFieldStep();
  if (State.curve && State.field && State.method) showResult();
});
