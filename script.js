console.log("script.js loaded");

/* ================================================================
   STATE
   ================================================================ */
const State = {
  category: null,  // line | surface | theorem
  curve: null,     // plane | space
  field: null,     // scalar | vector
  strategy: null,  // ds | dxdy | dxdydz | dxyz
  strategyLabel: null,
  surfaceType: null,   // scalar | vector
  surfaceForm: null,   // param | graph
  oriented: null,      // yes | no
  theoremType: null,   // line | surface
  theoremSurfaceKind: null, // flux | curl
  theoremCheck: null,  // yes | no
  volumeCoord: null, // cartesian | cylindrical | spherical
  mode: "student"
};

function resetState() {
  State.category = null;
  State.curve = null;
  State.field = null;
  State.strategy = null;
  State.strategyLabel = null;
  State.surfaceType = null;
  State.surfaceForm = null;
  State.oriented = null;
  State.theoremType = null;
  State.theoremSurfaceKind = null;
  State.theoremCheck = null;
  State.volumeCoord = null;
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
   BREADCRUMBS + GUIDE
   ================================================================ */
function breadcrumbs() {
  const bc = $("breadcrumbs");
  if (!bc) return;
  const parts = [];
  if (State.category) parts.push(State.category);
  if (State.category === "line") {
    if (State.curve) parts.push(State.curve);
    if (State.field) parts.push(State.field);
    if (State.strategy) parts.push(State.strategyLabel);
  }
  if (State.category === "surface") {
    if (State.surfaceType) parts.push(State.surfaceType);
    if (State.surfaceForm) parts.push(State.surfaceForm);
    if (State.oriented !== null) parts.push(State.oriented === "yes" ? "oriented" : "not oriented");
  }
    if (State.category === "volume") {
    if (State.volumeCoord === "cartesian") {
      formula = `\\[\\iiint_E f(x,y,z)\\,dV=\\iiint_E f(x,y,z)\\,dx\\,dy\\,dz\\]`;
    }
    if (State.volumeCoord === "cylindrical") {
      formula = `\\[\\iiint_E f(r,\\theta,z)\\,r\\,dr\\,d\\theta\\,dz\\]`;
    }
    if (State.volumeCoord === "spherical") {
      formula = `\\[\\iiint_E f(\\rho,\\theta,\\phi)\\,\\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta\\]`;
    }
  }

if (State.category === "theorem") {
    if (State.theoremType) parts.push(State.theoremType);
    if (State.theoremSurfaceKind) parts.push(State.theoremSurfaceKind);
    if (State.theoremCheck !== null) parts.push(State.theoremCheck === "yes" ? "yes" : "no");
  }
  bc.textContent = parts.length ? parts.join(" → ") : "Start by choosing the integral type.";
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
    } else if (step === "result" && key !== "result") {
      li.classList.add("done");
    } else if (step === "curve" && key === "category") {
      li.classList.add("done");
    } else if (step === "surface" && key === "category") {
      li.classList.add("done");
    } else if (step === "theorem" && key === "category") {
      li.classList.add("done");
    }
  });
}

function renderExample() {
  const card = $("example-card");
  if (!card) return;

  if (!State.category) {
    card.textContent = "Make a selection to see a worked example.";
    return;
  }

  const key = [State.category, State.curve, State.field, State.strategy, State.surfaceType, State.surfaceForm, State.theoremType, State.theoremSurfaceKind, State.theoremCheck].join("-");
  const examples = {
    "line-plane-scalar-ds": "<b>Example:</b> C: x=t, y=t^2, 0≤t≤1, f=x+y. Then \\int_C f\\,ds=\\int_0^1 (t+t^2)\\sqrt{1+4t^2}\\,dt.",
    "line-plane-vector-dxdy": "<b>Example:</b> F=(y,x^2), C: (t,t^2). Then \\int_C F·dr=\\int (y\\,dx+x^2\\,dy).",
    "line-space-scalar-ds": "<b>Example:</b> C: (t,t^2,t^3), f=x+z. Then \\int_C f\\,ds=\\int_0^1 (t+t^3)\\sqrt{1+4t^2+9t^4}\\,dt.",
    "surface-scalar-param": "<b>Example:</b> r(u,v)=(u,v,u^2+v^2). Use |r_u×r_v| in the integral.",
    "surface-scalar-graph": "<b>Example:</b> z=g(x,y)=x^2+y^2. Use \\sqrt{1+g_x^2+g_y^2}.",
    "surface-vector-param": "<b>Example:</b> F=(x,y,z) on r(u,v). Use F·(r_u×r_v).",
    "surface-vector-graph": "<b>Example:</b> Flux through z=g(x,y). Use (-P g_x - Q g_y + R).",
    "theorem-line-yes": "<b>Example:</b> Conservative field: F=∇f. Then \\int_C F·dr=f(B)-f(A).",
    "theorem-surface-flux-yes": "<b>Example:</b> Closed surface flux: use Divergence Theorem.",
    "theorem-surface-curl-yes": "<b>Example:</b> Surface with boundary: use Stokes' Theorem.",
  };

  card.innerHTML = examples[key] || "Complete the choices to see a worked example.";
  renderMath([card]);
}

/* ================================================================
   STEP 0 — Category
   ================================================================ */
function renderCategoryStep() {
  [
    "step-curve",
    "step-field",
    "step-method",
    "step-surface",
    "step-surface-type",
    "step-orient",
    "step-theorem",
    "step-theorem-type",
    "step-theorem-check",
    "step-volume",
  ].forEach((id) => {
    const el = $(id);
    if (el) el.classList.add("hidden");
  });
  clear($("step-category"));
  $("step-category").classList.remove("hidden");
  setProgress("category");
  setGuideText("Hello clever. What type of integral do you want to evaluate today? Let me help you find the right formula.");

  const title = document.createElement("h2");
  title.textContent = "Welcome — Choose your integral";
  $("step-category").appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Pick one and I will guide you step-by-step.";
  $("step-category").appendChild(subtitle);

  $("step-category").appendChild(
    button("Line integral", () => {
      resetState();
      State.category = "line";
      breadcrumbs();
      renderCurveStep();
    })
  );

  $("step-category").appendChild(
    button("Surface integral", () => {
      resetState();
      State.category = "surface";
      breadcrumbs();
      renderSurfaceTypeStep();
    })
  );

  $("step-category").appendChild(
    button("Volume integral", () => {
      resetState();
      State.category = "volume";
      breadcrumbs();
      renderVolumeStep();
    })
  );

  $("step-category").appendChild(
    button("Use a theorem", () => {
      resetState();
      State.category = "theorem";
      breadcrumbs();
      renderTheoremTypeStep();
    })
  );
}

/* ================================================================
   LINE INTEGRAL FLOW (existing)
   ================================================================ */
function renderCurveStep() {
  clear($("step-curve"));
  $("step-curve").classList.remove("hidden");
  $("step-field").classList.add("hidden");
  $("step-method").classList.add("hidden");
  setProgress("curve");
  setGuideText("Choose whether the curve lies in the plane or in space.");

  const title = document.createElement("h2");
  title.textContent = "Line Integrals — Curve Type";
  $("step-curve").appendChild(title);

  $("step-curve").appendChild(
    button("Plane Curve ℝ²", () => {
      State.curve = "plane";
      breadcrumbs();
      renderFieldStep();
    })
  );

  $("step-curve").appendChild(
    button("Space Curve ℝ³", () => {
      State.curve = "space";
      breadcrumbs();
      renderFieldStep();
    })
  );
}

function renderFieldStep() {
  clear($("step-field"));
  $("step-field").classList.remove("hidden");
  $("step-method").classList.add("hidden");
  setProgress("curve");
  setGuideText("Decide whether you are integrating a scalar field or a vector field.");

  const title = document.createElement("h2");
  title.textContent = "Line Integrals — Field Type";
  $("step-field").appendChild(title);

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

function renderStrategyStep() {
  clear($("step-method"));
  $("step-method").classList.remove("hidden");
  setProgress("curve");
  setGuideText("Choose arc length (ds) or coordinate form (dx, dy, dz).");

  const title = document.createElement("h2");
  title.textContent = "Line Integrals — Integration Form";
  $("step-method").appendChild(title);

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

  if (State.curve === "plane" && State.field === "vector") {
    State.strategy = "dxdy";
    State.strategyLabel = "dx, dy";
    breadcrumbs();
    showResult();
  }

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

  if (State.curve === "space" && State.field === "vector") {
    State.strategy = "dxyz";
    State.strategyLabel = "dx, dy, dz";
    breadcrumbs();
    showResult();
  }
}

/* ================================================================
   SURFACE INTEGRAL FLOW (from TikZ)
   ================================================================ */
function renderSurfaceTypeStep() {
  clear($("step-surface"));
  $("step-surface").classList.remove("hidden");
  $("step-surface-type").classList.add("hidden");
  $("step-orient").classList.add("hidden");
  setProgress("surface");
  setGuideText("Surface integrals split into scalar integrals and flux integrals.");

  const title = document.createElement("h2");
  title.textContent = "Surface Integrals — Field Type";
  $("step-surface").appendChild(title);

  $("step-surface").appendChild(
    button("Scalar Field", () => {
      State.surfaceType = "scalar";
      breadcrumbs();
      renderSurfaceFormStep();
    })
  );

  $("step-surface").appendChild(
    button("Vector Field (Flux)", () => {
      State.surfaceType = "vector";
      breadcrumbs();
      renderOrientationStep();
    })
  );
}

function renderSurfaceFormStep() {
  clear($("step-surface-type"));
  $("step-surface-type").classList.remove("hidden");
  setProgress("surface");
  setGuideText("Choose the surface description: parametric or graph.");

  const title = document.createElement("h2");
  title.textContent = "Surface Integrals — Surface Form";
  $("step-surface-type").appendChild(title);

  $("step-surface-type").appendChild(
    button("Parametric surface r(u,v)", () => {
      State.surfaceForm = "param";
      breadcrumbs();
      showResult();
    })
  );

  $("step-surface-type").appendChild(
    button("Graph z=g(x,y)", () => {
      State.surfaceForm = "graph";
      breadcrumbs();
      showResult();
    })
  );
}

function renderOrientationStep() {
  clear($("step-orient"));
  $("step-orient").classList.remove("hidden");
  $("step-surface-type").classList.add("hidden");
  setProgress("surface");
  setGuideText("Flux integrals require orientation.");

  const title = document.createElement("h2");
  title.textContent = "Surface Integrals — Orientation";
  $("step-orient").appendChild(title);

  $("step-orient").appendChild(
    button("Yes, oriented", () => {
      State.oriented = "yes";
      breadcrumbs();
      renderVectorSurfaceFormStep();
    })
  );

  $("step-orient").appendChild(
    button("No", () => {
      State.oriented = "no";
      breadcrumbs();
      showResult();
    })
  );
}

function renderVectorSurfaceFormStep() {
  clear($("step-surface-type"));
  $("step-surface-type").classList.remove("hidden");
  setProgress("surface");
  setGuideText("Choose the surface description for flux.");

  const title = document.createElement("h2");
  title.textContent = "Surface Integrals — Surface Form";
  $("step-surface-type").appendChild(title);

  $("step-surface-type").appendChild(
    button("Parametric surface r(u,v)", () => {
      State.surfaceForm = "param";
      breadcrumbs();
      showResult();
    })
  );

  $("step-surface-type").appendChild(
    button("Graph z=g(x,y)", () => {
      State.surfaceForm = "graph";
      breadcrumbs();
      showResult();
    })
  );
}

/* ================================================================
   VOLUME INTEGRAL FLOW
   ================================================================ */
function renderVolumeStep() {
  clear($("step-volume"));
  $("step-volume").classList.remove("hidden");
  setProgress("surface");
  setGuideText("Choose the coordinate system that best matches the region.");

  const title = document.createElement("h2");
  title.textContent = "Volume Integrals — Coordinate System";
  $("step-volume").appendChild(title);

  $("step-volume").appendChild(
    button("Cartesian (x, y, z)", () => {
      State.volumeCoord = "cartesian";
      breadcrumbs();
      showResult();
    })
  );

  $("step-volume").appendChild(
    button("Cylindrical (r, θ, z)", () => {
      State.volumeCoord = "cylindrical";
      breadcrumbs();
      showResult();
    })
  );

  $("step-volume").appendChild(
    button("Spherical (ρ, θ, φ)", () => {
      State.volumeCoord = "spherical";
      breadcrumbs();
      showResult();
    })
  );
}

/* ================================================================
   THEOREM FLOW (FTLI / Divergence / Stokes / Green)
   ================================================================ */
function renderTheoremTypeStep() {
  clear($("step-theorem"));
  $("step-theorem").classList.remove("hidden");
  $("step-theorem-type").classList.add("hidden");
  $("step-theorem-check").classList.add("hidden");
  setProgress("theorem");
  setGuideText("Choose the type of integral where you want a theorem shortcut.");

  const title = document.createElement("h2");
  title.textContent = "Theorem Guide — Integral Type";
  $("step-theorem").appendChild(title);

  $("step-theorem").appendChild(
    button("Line integral", () => {
      State.theoremType = "line";
      breadcrumbs();
      renderTheoremLineCheck();
    })
  );

  $("step-theorem").appendChild(
    button("Surface integral", () => {
      State.theoremType = "surface";
      breadcrumbs();
      renderTheoremSurfaceType();
    })
  );
}

function renderTheoremLineCheck() {
  clear($("step-theorem-type"));
  $("step-theorem-type").classList.remove("hidden");
  $("step-theorem-check").classList.add("hidden");
  setProgress("theorem");
  setGuideText("Check if the vector field is conservative for FTLI, or if Green's theorem applies.");

  const title = document.createElement("h2");
  title.textContent = "Line Integral Theorems";
  $("step-theorem-type").appendChild(title);

  $("step-theorem-type").appendChild(
    button("Field is conservative (F = ∇f)", () => {
      State.theoremCheck = "yes";
      State.theoremSurfaceKind = "ftli";
      breadcrumbs();
      showResult();
    })
  );

  $("step-theorem-type").appendChild(
    button("Closed plane curve; apply Green's theorem", () => {
      State.theoremCheck = "yes";
      State.theoremSurfaceKind = "green";
      breadcrumbs();
      showResult();
    })
  );

  $("step-theorem-type").appendChild(
    button("Neither applies", () => {
      State.theoremCheck = "no";
      State.theoremSurfaceKind = "ftli";
      breadcrumbs();
      showResult();
    })
  );
}

function renderTheoremSurfaceType() {
  clear($("step-theorem-type"));
  $("step-theorem-type").classList.remove("hidden");
  $("step-theorem-check").classList.add("hidden");
  setProgress("theorem");
  setGuideText("Choose flux or curl surface integral.");

  const title = document.createElement("h2");
  title.textContent = "Surface Integral Theorems";
  $("step-theorem-type").appendChild(title);

  $("step-theorem-type").appendChild(
    button("Flux integral", () => {
      State.theoremSurfaceKind = "flux";
      breadcrumbs();
      renderTheoremSurfaceCheck();
    })
  );

  $("step-theorem-type").appendChild(
    button("Curl integral", () => {
      State.theoremSurfaceKind = "curl";
      breadcrumbs();
      renderTheoremSurfaceCheck();
    })
  );
}

function renderTheoremSurfaceCheck() {
  clear($("step-theorem-check"));
  $("step-theorem-check").classList.remove("hidden");
  setProgress("theorem");

  const title = document.createElement("h2");
  if (State.theoremSurfaceKind === "flux") {
    setGuideText("Divergence Theorem applies if the surface is closed and oriented outward.");
    title.textContent = "Divergence Theorem Check";
  } else {
    setGuideText("Stokes' Theorem applies if the surface has a boundary curve.");
    title.textContent = "Stokes' Theorem Check";
  }
  $("step-theorem-check").appendChild(title);

  $("step-theorem-check").appendChild(
    button("Yes", () => {
      State.theoremCheck = "yes";
      breadcrumbs();
      showResult();
    })
  );

  $("step-theorem-check").appendChild(
    button("No", () => {
      State.theoremCheck = "no";
      breadcrumbs();
      showResult();
    })
  );
}

/* ================================================================
   FINAL FORMULAS
   ================================================================ */
function showResult() {
  const f = $("formula");
  const e = $("explanation");
  $("result").classList.remove("hidden");
  setProgress("result");

  let formula = "";
  let explanation = "";

  if (State.category === "line") {
    if (State.curve === "plane" && State.field === "scalar" && State.strategy === "ds") {
      formula = `
      \\
      \\
      \\[
      \\int_C f(x,y)\\,ds
      =
      \\int_a^b f(x(t),y(t))\\sqrt{(x'(t))^2+(y'(t))^2}\\,dt
      \\]
      `;
      explanation = State.mode === "instructor" ? `If y=g(x), then \\int_a^b f(x,g(x))\\sqrt{1+(g'(x))^2}\\,dx.` : "";
    }

    if (State.curve === "plane" && State.field === "scalar" && State.strategy === "dxdy") {
      formula = `
      \\[
      \\int_C f(x,y)\\,dx
      =
      \\int_a^b f(x(t),y(t))x'(t)\\,dt
      \\]
      `;
      explanation = State.mode === "instructor" ? "Similar formula for dy." : "";
    }

    if (State.curve === "plane" && State.field === "vector") {
      formula = `
      \\[
      \\int_C \\mathbf{F}\\cdot d\\mathbf{r}=
      \\int_C (P\\,dx+Q\\,dy)
      \\]
      `;
    }

    if (State.curve === "space" && State.field === "scalar" && State.strategy === "ds") {
      formula = `
      \\[
      \\int_C f(x,y,z)\\,ds
      =
      \\int_a^b f(x(t),y(t),z(t))\\sqrt{(x')^2+(y')^2+(z')^2}\\,dt
      \\]
      `;
    }

    if (State.curve === "space" && State.field === "scalar" && State.strategy === "dxdydz") {
      formula = `
      \\[
      \\int_C f(x,y,z)\\,dx
      =
      \\int_a^b f(x(t),y(t),z(t))x'(t)\\,dt
      \\]
      `;
    }

    if (State.curve === "space" && State.field === "vector") {
      formula = `
      \\[
      \\int_C \\mathbf{F}\\cdot d\\mathbf{r}=
      \\int_C (P\\,dx+Q\\,dy+R\\,dz)
      \\]
      `;
    }
  }

  if (State.category === "surface") {
    if (State.surfaceType === "scalar" && State.surfaceForm === "param") {
      formula = `
      \\[
      \\iint_S f\\,dS=
      \\iint_D f(\\mathbf{r}(u,v))\\,|\\mathbf{r}_u\\times\\mathbf{r}_v|\\,du\\,dv
      \\]
      `;
    }

    if (State.surfaceType === "scalar" && State.surfaceForm === "graph") {
      formula = `
      \\[
      \\iint_S f\\,dS=
      \\iint_D f(x,y,g(x,y))\\sqrt{1+g_x^2+g_y^2}\\,dA
      \\]
      `;
    }

    if (State.surfaceType === "vector" && State.oriented === "no") {
      formula = `\\[\\text{Flux integral not defined without orientation.}\\]`;
    }

    if (State.surfaceType === "vector" && State.oriented === "yes" && State.surfaceForm === "param") {
      formula = `
      \\[
      \\iint_S \\mathbf{F}\\cdot d\\mathbf{S}=
      \\iint_D \\mathbf{F}(\\mathbf{r}(u,v))\\cdot(\\mathbf{r}_u\\times\\mathbf{r}_v)\\,du\\,dv
      \\]
      `;
    }

    if (State.surfaceType === "vector" && State.oriented === "yes" && State.surfaceForm === "graph") {
      formula = `
      \\[
      \\iint_S \\mathbf{F}\\cdot d\\mathbf{S}=
      \\iint_D (-P g_x - Q g_y + R)\\,dA
      \\]
      `;
    }
  }

  if (State.category === "theorem") {
    if (State.theoremType === "line" && State.theoremSurfaceKind === "ftli" && State.theoremCheck === "yes") {
      formula = `
      \\[
      \\int_C \\mathbf{F}\\cdot d\\mathbf{r}=f(B)-f(A)
      \\]
      `;
      explanation = "Fundamental Theorem of Line Integrals";
    }

    if (State.theoremType === "line" && State.theoremSurfaceKind === "ftli" && State.theoremCheck === "no") {
      formula = `\\[\\text{FTLI not applicable.}\\]`;
    }

    if (State.theoremType === "line" && State.theoremSurfaceKind === "green") {
      formula = `
      \\[
      \\oint_C (P\\,dx+Q\\,dy)=
      \\iint_D \\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right) dA
      \\]
      `;
      explanation = "Green's Theorem";
    }

    if (State.theoremType === "surface" && State.theoremSurfaceKind === "flux" && State.theoremCheck === "yes") {
      formula = `
      \\[
      \\iint_S \\mathbf{F}\\cdot d\\mathbf{S}=
      \\iiint_E (\\nabla\\cdot\\mathbf{F})\\,dV
      \\]
      `;
      explanation = "Divergence Theorem";
    }

    if (State.theoremType === "surface" && State.theoremSurfaceKind === "flux" && State.theoremCheck === "no") {
      formula = `\\[\\text{Surface must be closed and oriented outward.}\\]`;
    }

    if (State.theoremType === "surface" && State.theoremSurfaceKind === "curl" && State.theoremCheck === "yes") {
      formula = `
      \\[
      \\iint_S (\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}=
      \\oint_C \\mathbf{F}\\cdot d\\mathbf{r}
      \\]
      `;
      explanation = "Stokes' Theorem";
    }

    if (State.theoremType === "surface" && State.theoremSurfaceKind === "curl" && State.theoremCheck === "no") {
      formula = `\\[\\text{Surface must have a boundary curve.}\\]`;
    }
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
      renderCategoryStep();
      breadcrumbs();
      renderExample();
    };
  }

  const modeSelect = $("mode-select");
  if (modeSelect) {
    modeSelect.onchange = (e) => {
      State.mode = e.target.value;
      if (State.category && (State.strategy || State.surfaceForm || State.theoremCheck !== null)) showResult();
    };
  }

  const smartInput = $("smart-input");
  const smartApply = $("smart-apply");
  const smartFeedback = $("smart-feedback");
  function applySmartSearch() {
    if (!smartInput) return;
    const q = smartInput.value.toLowerCase();
    resetState();

    if (q.includes("surface") || q.includes("flux")) State.category = "surface";
    if (q.includes("theorem") || q.includes("stokes") || q.includes("divergence") || q.includes("green") || q.includes("ftli")) State.category = "theorem";
    if (q.includes("volume") || q.includes("triple")) State.category = "volume";
    if (q.includes("line") && !State.category) State.category = "line";
    if (!State.category) State.category = "line";

    if (State.category === "line") {
      if (q.includes("plane") || q.includes("r2")) State.curve = "plane";
      if (q.includes("space") || q.includes("r3")) State.curve = "space";
      if (q.includes("scalar")) State.field = "scalar";
      if (q.includes("vector")) State.field = "vector";
      if (q.includes("ds") || q.includes("arc")) State.strategy = "ds";
      if (q.includes("dx") || q.includes("dy")) State.strategy = "dxdy";
      if (q.includes("dz")) State.strategy = "dxdydz";
    }

    if (State.category === "surface") {
      if (q.includes("scalar")) State.surfaceType = "scalar";
      if (q.includes("vector") || q.includes("flux")) State.surfaceType = "vector";
      if (q.includes("param")) State.surfaceForm = "param";
      if (q.includes("graph")) State.surfaceForm = "graph";
      if (q.includes("oriented") || q.includes("orientation")) State.oriented = "yes";
    }

    if (State.category === "theorem") {
      if (q.includes("line") || q.includes("green") || q.includes("ftli")) State.theoremType = "line";
      if (q.includes("surface") || q.includes("stokes") || q.includes("divergence")) State.theoremType = "surface";
      if (q.includes("green")) State.theoremSurfaceKind = "green";
      if (q.includes("ftli") || q.includes("conservative")) State.theoremSurfaceKind = "ftli";
      if (q.includes("divergence") || q.includes("flux")) State.theoremSurfaceKind = "flux";
      if (q.includes("stokes") || q.includes("curl")) State.theoremSurfaceKind = "curl";
    }

    renderCategoryStep();
    breadcrumbs();
    if (State.category === "line") {
      renderCurveStep();
      if (State.curve) renderFieldStep();
    }
    if (State.category === "surface") {
      renderSurfaceTypeStep();
    }
    if (State.category === "theorem") {
      renderTheoremTypeStep();
    }
    if (State.category === "volume") {
      renderVolumeStep();
    }
    if (smartFeedback) smartFeedback.textContent = "Applied your description. Continue the flow if needed.";
  }

  if (smartApply) smartApply.onclick = applySmartSearch;
  if (smartInput) {
    smartInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applySmartSearch();
    });
  }

  renderCategoryStep();
  breadcrumbs();
  renderExample();
});
