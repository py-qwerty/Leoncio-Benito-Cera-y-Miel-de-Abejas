/*
 * Leoncio Benito y Compañía · interacción del sitio.
 *
 * 1. Estado de la cabecera al hacer scroll.
 * 2. Aparición suave de los bloques al entrar en pantalla.
 * 3. La abeja del logotipo: sale del logo y va posándose en distintos
 *    puntos de la página (titulares, fotografías, botones, finales de
 *    párrafo) a medida que se baja. Si se vuelve arriba, regresa al logo.
 */
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  /* ---------- Cabecera ---------- */
  const header = document.querySelector(".site-header");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Aparición de bloques ---------- */
  if (!reducedMotion && "IntersectionObserver" in window) {
    const selector = [
      "main h2",
      "main .eyebrow",
      "main figure",
      "main article",
      "main blockquote",
      "main .page-hero__intro",
      "main .button",
      "main .company-provinces",
      "main .company-name-list",
      "main .company-partners__list",
      "main .archive-sources__grid > *",
      "main .expo-gallery__note",
      "main .expo-award",
    ].join(",");
    const hero = document.querySelector(".home-hero");
    const all = [...document.querySelectorAll(selector)].filter(
      (el) => !(hero && hero.contains(el))
    );
    const set = new Set(all);
    const items = all.filter((el) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => set.has(c));
      el.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ---------- La abeja ----------
   * Con «reducir movimiento» activado la abeja sigue presente, pero vuela
   * más despacio, sin trayectorias sinuosas y solo cambia de sitio al
   * hacer scroll.
   */
  const calm = reducedMotion;
  const logo = document.querySelector(".brand img");
  if (!logo || !document.querySelector("main")) return;

  // Centro de la abeja dentro del logotipo original (1712 × 722 px) y
  // equivalencia 1 unidad SVG = 1 px de la imagen original.
  const LOGO_W = 1712;
  const LOGO_H = 722;
  const LOGO_BEE = { x: 170, y: 590, rx: 128, ry: 92 };
  const VIEW = 260; // lado del viewBox de la abeja

  const wing = `
    <path class="bee__membrane" d="M-16,-44 C-40,-59 -86,-59 -109,-48 C-123,-41 -123,-27 -107,-24 C-82,-20 -46,-24 -15,-31 Z"/>
    <path class="bee__membrane" d="M-15,-26 C-45,-23 -82,-22 -102,-16 C-115,-11 -111,2 -94,2 C-66,2 -38,-6 -18,-14 Z"/>
    <path class="bee__vein" d="M-22,-37 C-42,-41 -56,-40 -66,-44 M-68,-51 C-64,-46 -62,-43 -58,-41 C-68,-39 -78,-38 -84,-36 C-78,-34 -72,-32 -70,-29"/>
    <path class="bee__vein" d="M-22,-19 C-44,-17 -58,-16 -68,-14 M-80,-21 C-74,-17 -72,-14 -70,-12 C-78,-10 -86,-9 -92,-6 C-84,-5 -78,-4 -74,-1"/>`;
  const wingSet = `
    <g class="bee__wing bee__wing--ghost" data-ghost="a">${wing}</g>
    <g class="bee__wing bee__wing--ghost" data-ghost="b">${wing}</g>
    <g class="bee__wing" data-ghost="">${wing}</g>`;

  const bee = document.createElement("div");
  bee.className = "bee";
  bee.setAttribute("aria-hidden", "true");
  bee.innerHTML = `
<svg class="bee__shadow" viewBox="-130 -130 260 260" focusable="false">
  <ellipse cx="0" cy="18" rx="24" ry="58"/>
  <ellipse cx="0" cy="-62" rx="12" ry="14"/>
  <g class="bee__shadow-wings">
    <ellipse cx="-62" cy="-28" rx="50" ry="20"/>
    <ellipse cx="62" cy="-28" rx="50" ry="20"/>
  </g>
</svg>
<svg class="bee__body" viewBox="-130 -130 260 260" focusable="false">
  <defs>
    <clipPath id="bee-abdomen">
      <path d="M0,-3 C14,-3 22,10 22,29 C22,49 12,65 0,72 C-12,65 -22,49 -22,29 C-22,10 -14,-3 0,-3 Z"/>
    </clipPath>
  </defs>
  <g class="bee__legs-front">
    <path class="bee__leg" d="M-17,-44 C-24,-54 -28,-63 -33,-70 C-37,-76 -42,-79 -48,-80"/>
    <path class="bee__leg" d="M17,-44 C24,-54 28,-63 33,-70 C37,-76 42,-79 48,-80"/>
  </g>
  <g class="bee__rear">
    <g class="bee__legs-rear">
      <path class="bee__leg" d="M-19,2 C-30,18 -36,38 -40,53 C-43,63 -48,71 -58,76"/>
      <path class="bee__leg" d="M19,2 C30,18 36,38 40,53 C43,63 48,71 58,76"/>
    </g>
    <path class="bee__ink" d="M0,-9 C18,-9 28,8 28,29 C28,52 15,71 0,79 C-15,71 -28,52 -28,29 C-28,8 -18,-9 0,-9 Z"/>
    <g clip-path="url(#bee-abdomen)">
      <path class="bee__stripe" style="stroke-width:3" d="M-24,-2 Q0,2 24,-2"/>
      <path class="bee__stripe" d="M-26,9 Q0,13 26,9 M-26,21 Q0,25 26,21 M-26,33 Q0,37 26,33 M-26,45 Q0,49 26,45 M-26,57 Q0,61 26,57"/>
      <path class="bee__stripe" style="stroke-width:4" d="M-24,67 Q0,70 24,67"/>
    </g>
  </g>
  <g class="bee__wings">
    <g data-side="l">${wingSet}</g>
    <g transform="scale(-1 1)" data-side="r">${wingSet}</g>
  </g>
  <ellipse class="bee__ink" cx="0" cy="-29" rx="22" ry="22"/>
  <path class="bee__paper" d="M0,-45 C7,-45 10,-40 9,-35 C8,-32 6,-31 7,-29 C12,-26 12,-18 6,-15 C2,-14 -2,-14 -6,-15 C-12,-18 -12,-26 -7,-29 C-6,-31 -8,-32 -9,-35 C-10,-40 -7,-45 0,-45 Z"/>
  <g class="bee__head">
    <path class="bee__ink" d="M0,-49 C-11,-49 -15,-56 -14,-64 C-13,-72 -11,-78 -8,-81 C-5,-78 -3,-74 0,-73 C3,-74 5,-78 8,-81 C11,-78 13,-72 14,-64 C15,-56 11,-49 0,-49 Z"/>
    <path class="bee__slit" d="M0,-68 L0,-56"/>
  </g>
</svg>`;
  document.body.appendChild(bee);

  const shadowEl = bee.querySelector(".bee__shadow");
  const bodyEl = bee.querySelector(".bee__body");
  const shadowWings = bee.querySelector(".bee__shadow-wings");
  const rears = [...bee.querySelectorAll(".bee__rear")];
  const frontLegs = bee.querySelector(".bee__legs-front");
  const head = bee.querySelector(".bee__head");
  const wings = [...bee.querySelectorAll(".bee__wing")].map((el) => ({
    el,
    ghost: el.dataset.ghost,
  }));

  /* ---------- Utilidades ---------- */
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const wrapAngle = (a) => {
    while (a > Math.PI) a -= TAU;
    while (a < -Math.PI) a += TAU;
    return a;
  };
  // Ruido suave: suma de senos con frecuencias no conmensurables.
  const noise = (t, seed) =>
    Math.sin(t * 0.73 + seed) * 0.5 +
    Math.sin(t * 1.61 + seed * 2.3) * 0.3 +
    Math.sin(t * 3.07 + seed * 4.1) * 0.2;

  // Las lecturas de layout se hacen como mucho una vez por fotograma.
  let frameId = 0;
  const perFrame = (fn) => {
    let id = -1;
    let value;
    return () => {
      if (id !== frameId) {
        value = fn();
        id = frameId;
      }
      return value;
    };
  };

  // Solo escribe en el DOM cuando el valor cambia de verdad.
  const cache = new WeakMap();
  const write = (el, key, value) => {
    let c = cache.get(el);
    if (!c) cache.set(el, (c = {}));
    if (c[key] === value) return;
    c[key] = value;
    if (key === "transform-attr") el.setAttribute("transform", value);
    else el.style[key] = value;
  };

  /* ---------- Geometría del logotipo ---------- */
  const logoGeometry = perFrame(() => {
    const r = logo.getBoundingClientRect();
    const k = Math.min(r.width / LOGO_W, r.height / LOGO_H); // object-fit: contain
    const h = LOGO_H * k;
    return {
      x: r.left + LOGO_BEE.x * k,
      y: r.top + (r.height - h) / 2 + LOGO_BEE.y * k,
      k,
      visible: r.bottom > 0 && r.top < window.innerHeight,
    };
  });

  const maskLogo = () => {
    // Coordenadas en la caja sin transformar de la imagen.
    const w = logo.offsetWidth;
    const hBox = logo.offsetHeight;
    const k = Math.min(w / LOGO_W, hBox / LOGO_H);
    const top = (hBox - LOGO_H * k) / 2;
    logo.style.setProperty("--bee-x", `${LOGO_BEE.x * k}px`);
    logo.style.setProperty("--bee-y", `${top + LOGO_BEE.y * k}px`);
    logo.style.setProperty("--bee-rx", `${LOGO_BEE.rx * k}px`);
    logo.style.setProperty("--bee-ry", `${LOGO_BEE.ry * k}px`);
  };

  /* ---------- Posaderos ---------- */
  let headerSticky = false;
  const headerBottom = perFrame(() =>
    header && headerSticky ? Math.max(0, header.getBoundingClientRect().bottom) : 0
  );

  const textEnd = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 2);
    return rects[rects.length - 1] || null;
  };

  const perchSources = [
    { sel: "main h1, main h2, .site-footer__name", kind: "text", weight: 1.6 },
    { sel: "main h3, main blockquote", kind: "text", weight: 1 },
    { sel: "main p:not(.eyebrow)", kind: "text", weight: 0.55 },
    { sel: "main img", kind: "image", weight: 1.4 },
    { sel: "main .button", kind: "edge", weight: 1.2 },
    { sel: "main .home-index article, main .document-card, main .company-team__role", kind: "edge", weight: 0.9 },
  ];

  // Solo se consideran los posaderos que están en pantalla, sin recorrer
  // toda la página cada vez que la abeja elige destino.
  const visiblePerches = new Set();
  const perchObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visiblePerches.add(entry.target.__perch);
      else visiblePerches.delete(entry.target.__perch);
    });
  });
  perchSources.forEach((src) => {
    document.querySelectorAll(src.sel).forEach((el) => {
      if (el.__perch) return;
      if (src.kind === "text" && el.textContent.trim().length < 12) return;
      el.__perch = { el, kind: src.kind, weight: src.weight };
      perchObserver.observe(el);
    });
  });

  // Devuelve un posadero concreto (elemento + desplazamiento relativo).
  const makePerch = (item, S) => {
    const r = item.el.getBoundingClientRect();
    if (r.width < 40 || r.height < 12) return null;
    let x;
    let y;
    let heading;
    if (item.kind === "text") {
      const last = textEnd(item.el);
      if (!last) return null;
      x = last.right + S * 0.32;
      y = last.top + last.height * 0.55;
      heading = -Math.PI / 2 + rand(-0.7, 0.5); // mirando hacia el texto
    } else if (item.kind === "image") {
      if (Math.random() < 0.55) {
        x = r.left + r.width * rand(0.18, 0.82);
        y = r.top + r.height * rand(0.2, 0.8);
        heading = rand(-Math.PI, Math.PI);
      } else {
        x = r.left + r.width * rand(0.12, 0.88);
        y = r.top + 3;
        heading = rand(-0.9, 0.9) + (Math.random() < 0.4 ? Math.PI : 0);
      }
    } else {
      x = r.left + r.width * rand(0.6, 0.92);
      y = r.top + 2;
      heading = rand(-1, 1);
    }
    return { el: item.el, ox: x - r.left, oy: y - r.top, heading, home: false };
  };

  const perchPoint = (perch) => {
    if (perch.transient) {
      // Punto de espera ligado a la pantalla mientras no hay dónde posarse.
      const hb = headerBottom();
      return {
        x: window.innerWidth * (0.5 + 0.28 * noise(time * 0.3, st.seed)),
        y: hb + (window.innerHeight - hb) * (0.5 + 0.22 * noise(time * 0.27, st.seed + 7)),
      };
    }
    if (perch.home) {
      const g = logoGeometry();
      return { x: g.x, y: g.y };
    }
    const r = perch.el.getBoundingClientRect();
    return { x: r.left + perch.ox, y: r.top + perch.oy };
  };

  const inBand = (pt, S, strict) => {
    const top = headerBottom() + S * (strict ? 0.9 : 0.4);
    const bottom = window.innerHeight - S * (strict ? 0.9 : 0.4);
    return pt.y > top && pt.y < bottom && pt.x > S * 0.5 && pt.x < window.innerWidth - S * 0.5;
  };

  /* ---------- Estado ---------- */
  const st = {
    S: 52,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    heading: 0,
    angVel: 0,
    z: 0, // altitud: 0 posada, 1 en vuelo
    scale: 1,
    mode: "perched", // perched | flying | landing
    perch: { home: true, heading: 0 },
    recent: [],
    modeTime: 0,
    restFor: rand(1.8, 2.6),
    landScrollY: window.scrollY,
    approachTime: 0,
    flap: 0,
    fold: 1, // 1 alas plegadas · 0 abiertas
    twitch: 0,
    nextTwitch: rand(1.5, 4),
    turnTarget: 0,
    seed: rand(0, 100),
    lastScrollY: window.scrollY,
    scrollDir: 1,
    scrollIdle: 0,
    mouse: { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 },
    running: true,
  };

  if (/[?&]beedebug\b/.test(location.search)) window.__bee = st;

  const setSize = () => {
    st.S = window.innerWidth < 740 ? 44 : 54;
    bee.style.setProperty("--bee-size", `${st.S}px`);
    headerSticky = !!header && getComputedStyle(header).position === "sticky";
    maskLogo();
  };

  const homeScale = () => (logoGeometry().k * VIEW) / st.S;

  const choosePerch = () => {
    const S = st.S;
    const vh = window.innerHeight;
    const hb = headerBottom();
    const g = logoGeometry();
    // Arriba del todo, la abeja prefiere volver al logotipo.
    if (window.scrollY < 40 && g.visible && !st.perch.home && Math.random() < 0.5) {
      return { home: true, heading: 0 };
    }
    let best = null;
    let bestScore = -Infinity;
    const avail = vh - hb;
    visiblePerches.forEach((item) => {
      if (st.recent.includes(item.el)) return;
      const r = item.el.getBoundingClientRect();
      if (r.bottom < hb || r.top > vh) return;
      const perch = makePerch(item, S);
      if (!perch) return;
      const pt = perchPoint(perch);
      if (!inBand(pt, S, true)) return;
      const dist = Math.hypot(pt.x - st.x, pt.y - st.y);
      if (dist < S * 1.6) return;
      // Preferencia por el contenido que va apareciendo según el scroll.
      const rel = (pt.y - hb) / avail; // 0 arriba · 1 abajo
      const ideal = st.scrollDir > 0 ? 0.62 : 0.38;
      const score =
        item.weight * rand(0.6, 1.4) -
        Math.abs(rel - ideal) * 1.6 -
        Math.max(0, dist - window.innerWidth * 0.7) / 900;
      if (score > bestScore) {
        bestScore = score;
        best = perch;
      }
    });
    return best;
  };

  const retarget = () => choosePerch() || { transient: true, home: false, heading: 0 };

  const takeOff = (perch) => {
    if (st.mode === "perched") {
      // Pequeño impulso hacia arriba y hacia delante al despegar.
      const f = Math.sin(st.heading);
      const b = -Math.cos(st.heading);
      st.vx = f * 60 + rand(-40, 40);
      st.vy = b * 60 - 50;
      logo.classList.add("is-bee-away");
    }
    if (!st.perch.home && st.perch.el) {
      st.recent.push(st.perch.el);
      if (st.recent.length > 4) st.recent.shift();
    }
    st.perch = perch;
    st.mode = "flying";
    st.modeTime = 0;
    st.approachTime = 0;
  };

  const land = () => {
    st.mode = "perched";
    st.modeTime = 0;
    st.vx = 0;
    st.vy = 0;
    st.landScrollY = window.scrollY;
    st.restFor = st.perch.home ? rand(6, 12) : rand(5, 11);
    st.turnTarget = st.heading;
  };

  /* ---------- Entrada: scroll y puntero ---------- */
  window.addEventListener(
    "scroll",
    () => {
      const dy = window.scrollY - st.lastScrollY;
      if (Math.abs(dy) > 1) st.scrollDir = Math.sign(dy);
      st.lastScrollY = window.scrollY;
      st.scrollIdle = 0;
    },
    { passive: true }
  );

  const onPointer = (e) => {
    const now = performance.now();
    const m = st.mouse;
    const dt = Math.max(1, now - m.t) / 1000;
    if (m.t) {
      m.vx = lerp(m.vx, (e.clientX - m.x) / dt, 0.3);
      m.vy = lerp(m.vy, (e.clientY - m.y) / dt, 0.3);
    }
    m.x = e.clientX;
    m.y = e.clientY;
    m.t = now;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener(
    "pointerdown",
    (e) => {
      onPointer(e);
      if (Math.hypot(e.clientX - st.x, e.clientY - st.y) < st.S * 1.4) {
        st.mouse.vx = (st.x - e.clientX) * 20;
        st.mouse.vy = (st.y - e.clientY) * 20;
        if (st.mode === "perched") takeOff(retarget());
      }
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => {
    st.mouse.x = -9999;
    st.mouse.y = -9999;
  });

  /* ---------- Simulación ---------- */
  let time = 0;

  const step = (dt) => {
    time += dt;
    st.modeTime += dt;
    st.scrollIdle += dt;
    const S = st.S;
    const m = st.mouse;
    const mouseDist = Math.hypot(m.x - st.x, m.y - st.y);
    const decay = Math.exp(-dt * 6);
    m.vx *= decay;
    m.vy *= decay;
    const target = perchPoint(st.perch);

    if (st.mode === "perched") {
      st.angVel *= Math.exp(-dt * 8);
      if (Math.abs(st.angVel) < 0.01) st.angVel = 0;
      st.x = target.x;
      st.y = target.y;
      st.z = lerp(st.z, 0, 1 - Math.exp(-dt * 10));
      st.fold = lerp(st.fold, 1, 1 - Math.exp(-dt * 9));

      // Pequeños giros sobre el sitio, como si caminara.
      if (!st.perch.home) {
        if (Math.random() < dt * 0.35) st.turnTarget = st.heading + rand(-0.6, 0.6);
        st.heading = wrapAngle(st.heading + wrapAngle(st.turnTarget - st.heading) * (1 - Math.exp(-dt * 3)));
      } else {
        st.heading += wrapAngle(0 - st.heading) * (1 - Math.exp(-dt * 6));
      }

      const moved = Math.abs(window.scrollY - st.landScrollY);
      const lostPerch = !st.perch.home && !inBand(target, S, false);
      const homeGone = st.perch.home && !logoGeometry().visible && st.modeTime > 0.4;
      const scrolledAway = moved > window.innerHeight * 0.4 && st.modeTime > 0.5;
      const disturbed = mouseDist < S * 1.1 && Math.hypot(m.vx, m.vy) > 60;
      const rested = !calm && st.modeTime > st.restFor && st.scrollIdle > 1.2;

      if (lostPerch || homeGone || scrolledAway || disturbed) {
        takeOff(retarget());
      } else if (rested) {
        // Tras un rato quieta, salta a otro sitio cercano si lo hay.
        const next = choosePerch();
        if (next) takeOff(next);
        else st.restFor += 2;
      }
    } else {
      // --- Vuelo ---
      const tx = target.x;
      const ty = target.y;
      if (st.perch.transient) {
        if (st.modeTime > 0.8 && Math.random() < dt * 2) {
          const next = choosePerch();
          if (next) takeOff(next);
        }
      } else if (!st.perch.home && !inBand(target, S, false) && st.modeTime > 0.3) {
        takeOff(retarget());
      }

      const dx = tx - st.x;
      const dy = ty - st.y;
      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(st.vx, st.vy);
      const approaching = dist < S * 1.8 && !st.perch.transient;

      // Antes de posarse, revolotea un instante alrededor del punto.
      let hx = 0;
      let hy = 0;
      if (approaching) {
        st.approachTime += dt;
        const hover = calm ? 0 : Math.max(0, 1 - st.approachTime / 0.9);
        const a = time * 5.2;
        hx = Math.sin(a) * S * 0.45 * hover;
        hy = Math.sin(a * 2) * S * 0.22 * hover - S * 0.25 * hover;
      }
      const gx = tx + hx - st.x;
      const gy = ty + hy - st.y;
      const gd = Math.hypot(gx, gy) || 1;

      const maxSpeed = (st.perch.home ? 420 : 520) * (calm ? 0.7 : 1);
      const arrive = Math.min(maxSpeed, gd * (approaching ? 3 : 2.2) + 30 * clamp(gd / 60, 0, 1));
      const gain = approaching ? 7 : 4.5;
      let ax = ((gx / gd) * arrive - st.vx) * gain;
      let ay = ((gy / gd) * arrive - st.vy) * gain;

      // Trayectoria curva: empuje lateral con ruido, menor cerca del objetivo.
      if (speed > 30) {
        const wander = noise(time * 1.4, st.seed) * (calm ? 350 : 1300) * clamp((dist - 50) / 260, 0, 1);
        ax += (-st.vy / speed) * wander;
        ay += (st.vx / speed) * wander;
      }

      // Esquiva el puntero si se acerca deprisa.
      if (mouseDist < S * 2.2) {
        const push = (1 - mouseDist / (S * 2.2)) * 2600;
        ax += ((st.x - m.x) / (mouseDist || 1)) * push;
        ay += ((st.y - m.y) / (mouseDist || 1)) * push;
      }

      const aMag = Math.hypot(ax, ay);
      const maxForce = approaching ? 2600 : 2100;
      if (aMag > maxForce) {
        ax = (ax / aMag) * maxForce;
        ay = (ay / aMag) * maxForce;
      }
      st.vx += ax * dt;
      st.vy += ay * dt;
      st.x += st.vx * dt;
      st.y += st.vy * dt;

      // Rumbo: sigue la velocidad; al revolotear se orienta al posadero.
      const sp = Math.hypot(st.vx, st.vy);
      let want = st.heading;
      if (approaching && st.approachTime > 0.45) want = st.perch.heading;
      else if (sp > 70) want = Math.atan2(st.vx, -st.vy);
      const prev = st.heading;
      st.heading = wrapAngle(st.heading + wrapAngle(want - st.heading) * (1 - Math.exp(-dt * (approaching ? 5 : 7))));
      st.angVel = lerp(st.angVel, wrapAngle(st.heading - prev) / dt, 0.2);

      // Altitud: baja al posarse.
      const landing = approaching && st.approachTime > 0.6;
      const zTarget = landing ? clamp((dist - 2) / (S * 0.9), 0, 1) : 1 + noise(time * 2, st.seed + 3) * 0.06;
      st.z = lerp(st.z, zTarget, 1 - Math.exp(-dt * (landing ? 7 : 3)));
      st.fold = lerp(st.fold, 0, 1 - Math.exp(-dt * 14));

      // Últimos milímetros: se asienta con suavidad sobre el punto exacto.
      if (landing && dist < S * 0.35) {
        const settle = 1 - Math.exp(-dt * 9);
        st.x = lerp(st.x, tx, settle);
        st.y = lerp(st.y, ty, settle);
        st.vx *= 1 - settle;
        st.vy *= 1 - settle;
      }

      if (landing && dist < 1.5 && st.z < 0.08) {
        st.x = tx;
        st.y = ty;
        land();
      }
    }

    // Escala: tamaño del logo en casa, algo mayor cuanto más alto vuela.
    const flyScale = 0.9 + 0.12 * st.z;
    let scaleTarget = flyScale;
    if (st.perch.home) {
      const d = Math.hypot(target.x - st.x, target.y - st.y);
      scaleTarget = lerp(homeScale(), flyScale, clamp(d / 160, 0, 1));
      if (st.mode === "perched") scaleTarget = homeScale();
    }
    st.scale = lerp(st.scale, scaleTarget, 1 - Math.exp(-dt * 8));

    if (st.mode === "perched" && st.perch.home && st.modeTime > 0.05) {
      logo.classList.remove("is-bee-away");
    }
  };

  /* ---------- Render ---------- */
  // Sobre fondos oscuros la abeja se dibuja en claro, como un grabado invertido.
  const DARK = ".site-footer, .home-hero__media, .expo-gallery__main, .skip-link";
  let frame = 0;
  const updateTone = () => {
    const hit = document.elementFromPoint(clamp(st.x, 0, window.innerWidth - 1), clamp(st.y, 0, window.innerHeight - 1));
    bee.classList.toggle("is-on-dark", !!(hit && hit.closest(DARK)));
  };

  const render = (dt) => {
    if (frame++ % 10 === 0 && (st.mode !== "perched" || st.modeTime < 0.3 || st.scrollIdle < 0.2)) updateTone();
    const S = st.S;
    const flying = st.mode !== "perched";

    // Balanceo de vuelo: pequeña oscilación de posición.
    const bob = st.z * S * 0.06;
    const jx = noise(time * 3.1, st.seed + 11) * bob;
    const jy = noise(time * 2.7, st.seed + 17) * bob;
    const x = st.x + jx;
    const y = st.y + jy;
    const s = st.scale;
    const roll = 1 - clamp(Math.abs(st.angVel) * 0.03, 0, 0.14);
    const h = st.heading.toFixed(3);

    // Valores redondeados: posada y quieta, no se escribe nada en el DOM.
    write(bodyEl, "transform", `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${h}rad) scale(${(s * roll).toFixed(3)},${s.toFixed(3)})`);

    const sx = x + (3 + st.z * 16) * s;
    const sy = y + (4 + st.z * 24) * s;
    const ss = s * (1 - st.z * 0.12);
    write(shadowEl, "transform", `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0) rotate(${h}rad) scale(${ss.toFixed(3)})`);
    write(shadowEl, "opacity", (0.3 - st.z * 0.16).toFixed(2));
    write(shadowWings, "opacity", flying && quality < 1 ? ((1 - st.fold) * 0.5).toFixed(2) : "0");

    // Alas: barrido rápido hacia delante y atrás (vista cenital).
    st.flap += dt * TAU * (flying ? 18.7 : 0);
    if (!flying) {
      st.nextTwitch -= dt;
      if (st.nextTwitch < 0) {
        st.twitch = 0.28;
        st.nextTwitch = rand(1.8, 5);
      }
      if (st.twitch > 0) {
        st.twitch -= dt;
        st.flap += dt * TAU * 11;
      }
    }
    const open = 1 - st.fold;
    const amp = 36 * open + (st.twitch > 0 ? 6 : 0);
    const base = lerp(-4, -58, st.fold);
    const sweep = Math.sin(st.flap) * amp;
    const ghosts = quality < 1 && flying;
    const ghostOpacity = ghosts ? (0.16 * open).toFixed(2) : "0";
    wings.forEach(({ el, ghost }) => {
      if (ghost) {
        write(el, "opacity", ghostOpacity);
        if (!ghosts) return;
      }
      let a = base + sweep;
      if (ghost === "a") a = base + amp;
      if (ghost === "b") a = base - amp;
      write(el, "transform-attr", `rotate(${a.toFixed(1)} -15 -32)`);
    });

    // El abdomen se retrasa en los giros; patas y cabeza con leve vida.
    const tail = clamp(-st.angVel * 3.5, -12, 12);
    rears.forEach((g) => write(g, "transform-attr", `rotate(${tail.toFixed(1)} 0 -8)`));
    const legSwing = flying ? noise(time * 4, st.seed + 5) * 4 : 0;
    write(frontLegs, "transform-attr", `rotate(${legSwing.toFixed(1)} 0 -44) translate(0 ${flying ? 3 : 0})`);
    const nod = flying ? noise(time * 2, st.seed + 9) * 5 : 0;
    write(head, "transform-attr", `rotate(${nod.toFixed(1)} 0 -49)`);
  };

  /* ---------- Calidad adaptativa ----------
   * 0: completa · 1: sin alas fantasma, sombra sin desenfoque ni efectos
   * pesados de la página · 2: además, la abeja se dibuja a 30 fps.
   * Solo baja de nivel, nunca sube, para no alternar.
   */
  let quality = 0;
  const setQuality = (q) => {
    quality = q;
    bee.classList.toggle("is-lite", q >= 1);
    root.classList.toggle("is-lite", q >= 1);
  };
  const lowEnd =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.connection && navigator.connection.saveData);
  if (lowEnd) setQuality(1);
  if (window.__bee) window.__beeQuality = setQuality;

  let frameEma = 1 / 60;
  let measured = 0;
  let slowFor = 0;
  const measure = (raw) => {
    if (raw > 0.25) return; // pestaña en pausa, carga o pantalla bloqueada
    measured++;
    frameEma = lerp(frameEma, raw, 0.05);
    if (measured < 90 || quality >= 2) return;
    slowFor = frameEma > 1 / 42 ? slowFor + raw : 0;
    if (slowFor > 1.5) {
      setQuality(quality + 1);
      slowFor = 0;
      measured = 60;
      frameEma = 1 / 60;
    }
  };

  /* ---------- Bucle ---------- */
  let last = 0;
  let pending = 0;
  const loop = (now) => {
    if (!st.running) return;
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    measure(raw);
    pending += Math.min(raw, 1 / 24);
    // En el nivel 2 se simula y dibuja un fotograma de cada dos.
    if (quality < 2 || pending >= 1 / 40) {
      frameId++;
      const dt = Math.min(pending, 1 / 20);
      pending = 0;
      step(dt);
      render(dt);
    }
    requestAnimationFrame(loop);
  };

  const start = () => {
    setSize();
    const g = logoGeometry();
    st.x = g.x;
    st.y = g.y;
    st.scale = homeScale();
    // Si la página se abre lejos del logo, entra volando desde arriba.
    if (!g.visible) {
      st.x = window.innerWidth * 0.5;
      st.y = -st.S;
      st.z = 1;
      st.fold = 0;
      st.scale = 1;
      st.mode = "flying";
      st.perch = retarget();
      logo.classList.add("is-bee-away");
    }
    bee.classList.add("is-ready");
    requestAnimationFrame(loop);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      st.running = false;
    } else if (!st.running) {
      st.running = true;
      last = 0;
      requestAnimationFrame(loop);
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSize, 150);
  });

  if (logo.complete) start();
  else logo.addEventListener("load", start, { once: true });
})();
