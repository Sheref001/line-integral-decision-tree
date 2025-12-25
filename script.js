/* ================================================================
   Line Integral Decision Tree – Full Working Script
   ================================================================ */

console.log("script.js loaded");

/* ================================================================
   STATE
   ================================================================ */
const State = {
  curve: null,   // "plane" | "space"
  field: null,   // "scalar" | "vector"
  method: null   // method key
};

function resetState() {
  State.curve = null;
  State.field = null;
  State.method = null;
}

/* ================================================================
   DECISION TABLE (single source of truth)
   ================================================================ */
const DecisionTable = {
  plane: {
    label: "Plane curve",
    scalar: {
      label: "Scalar field",
      methods: {
        ds: {
          label: "Arc length (ds)",
          formula: `\\[ \\int_C f(x,y)\\, ds \\]`,
          explanation:
            "A scalar field integrated along a plane curve is written using the arc-length differential."
        },
        dxdy: {
          label: "Cartesian (dx, dy)",
          formula: `\\[ \\int_C f(x,y)\\,dx + g(x,y)\\,dy \\]`,
          explanation:
            "When the curve is described in Cartesian form, the integral is expressed using dx and dy."
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
          explanation:
            "This line integral represents the work done by a planar vector field along the curve."
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
          explanation:
            "A scalar field integrated along a space curve uses the arc-length differential."
        },
        dxyz: {
          label: "Parametric form",
          formula: `\\[
            \\int_C f(x,y,z)
            \\left| \\frac{d\\mathbf{r}}{dt} \\right| dt
          \\]`,
          explanation:
            "For a parametrized space curve, the integral is written in terms of the parameter."
        }
      }
    },
    vector: {
      label: "Vector field",
      methods: {
        dxyz: {
          label: "Work integral",
          formula: `\\[ \\int_C \\mathbf{F}\\cdot d\\mathbf{r} \\]`,
          explanation:
            "The line integral of a vector field in space measures the work done along the curve."
        }
      }
    }
  }
};

/* ================================================================
   DOM UTILITIES
   ================================================================ */
function $(id) {
  return document.getElementById(id);
}

function clear(el) {
  el.innerHTML = "";
}

function button(text, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "choice";
  btn.addEventListener("click", onClick);
  return btn;
}

/* ================================================================
   MATHJAX (safe rendering)
   ================================================================ */
function renderMath(elements) {
  if (!window.MathJax || !MathJax.typesetPromise) return;

  MathJax.typesetClear(elements);
  MathJax.typesetPromise(elements).catch(err =>
    console.error("MathJax error:", err)
  );
}

/* ================================================================
   BREADCRUMBS
   ================================================================ */
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
  const bc = $("breadcrumbs");
  if (!bc) return;

  bc.innerHTML = "";
  const crumbs = getBreadcrumbs();

  crumbs.forEach((text, index) => {
    const span = document.createElement("span");
    span.textContent = text;
    span.className = "breadcrumb";

    // Make only earlier crumbs clickable
    if (index < crumbs.length - 1) {
      span.classList.add("clickable");
      span.addEventListener("click", () =>
        navigateToLevel(index)
      );
    }

    bc.appendChild(span);

    if (index < crumbs.length - 1) {
      bc.appendChild(document.createTextNode(" → "));
    }
  });
}

/* ================================================================
   URL SYNC (shareable links)
   ================================================================ */
function updateURL() {
  const p = new URLSearchParams();

  if (State.curve) p.set("curve", State.curve);
  if (State.field) p.set("field", State.field);
  if (State.method) p.set("method", State.method);

  const qs = p.toString();
  history.replaceState(null, "", qs ? "?" + qs : location.pathname);
}

function loadStateFromURL() {
  const p = new URLSearchParams(window.location.search);

  if (DecisionTable[p.get("curve")])
    State.curve = p.get("curve");

  if (
    State.curve &&
    DecisionTable[State.curve][p.get("field")]
  ) {
    State.field = p.get("field");
  }

  if (
    State.curve &&
    State.field &&
    DecisionTable[State.curve][State.field].methods[p.get("method")]
  ) {
    State.method = p.get("method");
  }
}

/* ================================================================
   UI RENDERING
   ================================================================ */
function renderCurveStep() {
  const c = $("step-curve");
  clear(c);

  Object.entries(DecisionTable).forEach(([key, node]) => {
    c.appendChild(
      button(node.label, () => {
        resetState();
        State.curve = key;
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

  Object.entries(DecisionTable[State.curve]).forEach(([key, node]) => {
    if (key === "label") return;

    c.appendChild(
      button(node.label, () => {
        State.field = key;
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

  // Auto-select if only one method
  if (keys.length === 1) {
    State.method = keys[0];
    updateURL();
    renderBreadcrumbs();
    showResult();
    return;
  }

  keys.forEach(key => {
    c.appendChild(
      button(methods[key].label, () => {
        State.method = key;
        updateURL();
        renderBreadcrumbs();
        showResult();
      })
    );
  });
}

/* ================================================================
   RESULT
   ================================================================ */
function showResult() {
  const node =
    DecisionTable[State.curve]
      [State.field]
      .methods[State.method];

  $("formula").innerHTML = node.formula;
  $("explanation").innerHTML = node.explanation;
  $("result").classList.remove("hidden");

  renderMath([
    $("formula"),
    $("explanation")
  ]);
}

/* ================================================================
   INITIALIZATION
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  resetState();
  loadStateFromURL();

  renderCurveStep();
  renderBreadcrumbs();

  if (State.curve && State.field) renderFieldStep();
  if (State.curve && State.field && State.method) showResult();
});
