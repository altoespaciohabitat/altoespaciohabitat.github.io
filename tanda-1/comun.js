/* Alto Espacio Hábitat · código compartido por las 4 pantallas */
(() => {
  /* ===== Ajustes que puedes cambiar ===== */
  const WHATSAPP = "525612422195"; // Número con lada de país, sin espacios

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Math.round(n));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const NS = "http://www.w3.org/2000/svg";

  /* ---------- WhatsApp ---------- */
  const state = { unit: null, rent: 11600, rentEdited: false, scheme: "fin1" };
  const MSGS = {
    general: () => "Hola, visité el sitio de Alto Espacio Hábitat y me gustaría recibir información.",
    consultorio: () => "Hola, me interesa un consultorio en Médica Country. ¿Me podrían compartir planos y precios?",
    casa: () => "Hola, estoy buscando casa o terreno. Zona de interés: ___. Presupuesto: ___.",
    depa: () => "Hola, estoy buscando departamento. Zona de interés: ___. Recámaras: ___. Presupuesto: ___."
  };
  const waUrl = text => (WHATSAPP ? `https://wa.me/${WHATSAPP}` : "https://wa.me/") + "?text=" + encodeURIComponent(text);
  function refreshWa() {
    $$(".wa-link").forEach(a => { const f = MSGS[a.dataset.msg] || MSGS.general; a.href = waUrl(f()); });
  }
  // 525612422195 → "+52 56 1242 2195"
  const waNum = $("#waNum");
  if (WHATSAPP && waNum) waNum.textContent = WHATSAPP.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 $2 $3 $4");
  $$('#pickForm input[name="int"]').forEach(r => r.addEventListener("change", () => { $("#pickWa").dataset.msg = r.value; refreshWa(); }));
  const pickForm = $("#pickForm");
  if (pickForm) pickForm.addEventListener("submit", e => e.preventDefault());

  /* ---------- Utilidades de dibujo ---------- */
  function mk(parent, tag, attrs) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  }
  // Crea un trazo que se dibuja entre los momentos a y b (0 a 1)
  function stroke(svg, d, a, b, cls = "") {
    const p = mk(svg, "path", { d, pathLength: "1", class: cls });
    p.style.strokeDasharray = "1 1";
    p.style.strokeDashoffset = "1";
    p._a = a; p._b = b;
    return p;
  }
  const R = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
  const L = (x1, y1, x2, y2) => `M${x1} ${y1}L${x2} ${y2}`;
  // Reparte una lista de trazos en orden dentro de [a, b]
  function seq(svg, list, a, b, over = 2.2) {
    const n = list.length, step = (b - a) / (n + over - 1);
    return list.map((it, i) => stroke(svg, it.d, a + i * step, a + (i + over) * step, it.c || ""));
  }
  function render(paths, p) {
    for (const e of paths) {
      const t = clamp((p - e._a) / (e._b - e._a));
      e.style.strokeDashoffset = (1 - t).toFixed(4);
    }
  }
  // Dibuja los trazos solos en "ms" milisegundos; al final llama a done()
  function play(paths, ms, done) {
    let finished = false;
    const end = () => { if (finished) return; finished = true; render(paths, 1); if (done) done(); };
    if (reduce) return end();
    const t0 = performance.now();
    const f = now => {
      const p = Math.min(1, Math.max(0, now - t0) / ms);
      render(paths, p);
      if (p < 1) requestAnimationFrame(f); else end();
    };
    requestAnimationFrame(f);
    setTimeout(end, ms + 1200); // por si el navegador frena la animación
  }
  // Ejecuta fn una sola vez, cuando el elemento aparece en pantalla
  // (con respaldo: algunos visores no avisan al observador, así que también se revisa la posición al hacer scroll)
  function whenVisible(el, fn) {
    if (!el) return;
    let done = false, io = null;
    const go = () => {
      if (done) return;
      done = true;
      if (io) io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      fn();
    };
    function check() {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight * 0.92 && r.height > 0) go();
    }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) go(); }, { threshold: 0.2 });
      io.observe(el);
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    setTimeout(check, 300);
  }

  /* ---------- Dibujos chicos ---------- */
  const minis = [];
  $$("svg.mini").forEach(svg => {
    const k = svg.dataset.mini; let list = [];
    if (k === "tower") {
      list = [{ d: L(20, 180, 280, 180), c: "thin" }, { d: R(110, 30, 80, 150) }, { d: R(122, 20, 56, 10) }];
      for (let i = 1; i < 9; i++) list.push({ d: L(110, 180 - i * 16, 190, 180 - i * 16), c: "thin" });
      list.push({ d: L(150, 164, 150, 30), c: "thin" });
    } else if (k === "house") {
      list = [{ d: L(20, 160, 280, 160), c: "thin" }, { d: R(70, 105, 110, 55) }, { d: R(110, 70, 120, 35) }, { d: L(100, 70, 245, 70) },
        { d: R(82, 118, 40, 42), c: "thin" }, { d: R(130, 80, 80, 16), c: "thin" }, { d: L(40, 176, 260, 176), c: "thin" }, { d: L(40, 170, 40, 182), c: "thin" }, { d: L(260, 170, 260, 182), c: "thin" }];
    } else if (k === "apts") {
      list = [{ d: L(20, 180, 280, 180), c: "thin" }, { d: R(95, 50, 110, 130) }];
      for (let i = 1; i < 6; i++) list.push({ d: L(95, 180 - i * 22, 205, 180 - i * 22), c: "thin" });
      for (let i = 0; i < 6; i++) [105, 140, 175].forEach(x => list.push({ d: R(x, 180 - (i + 1) * 22 + 6, 20, 10), c: "thin" }));
    } else if (k === "lot") {
      // Planta de terreno con casa y cotas
      list = [{ d: R(60, 30, 200, 120), c: "heavy" }, { d: R(110, 55, 100, 64) }, { d: L(160, 55, 160, 119), c: "thin" }, { d: L(110, 90, 160, 90), c: "thin" },
        { d: L(60, 18, 260, 18), c: "thin" }, { d: L(60, 12, 60, 24), c: "thin" }, { d: L(260, 12, 260, 24), c: "thin" },
        { d: L(276, 30, 276, 150), c: "thin" }, { d: L(270, 30, 282, 30), c: "thin" }, { d: L(270, 150, 282, 150), c: "thin" },
        { d: "M84 140a10 10 0 1 1 0.1 0", c: "thin" }, { d: "M236 52a9 9 0 1 1 0.1 0", c: "thin" }];
    } else if (k === "flat") {
      // Planta de departamento
      list = [{ d: R(50, 26, 220, 128), c: "heavy" }, { d: L(150, 26, 150, 154) }, { d: L(150, 96, 270, 96) }, { d: L(50, 100, 110, 100) },
        { d: R(66, 40, 62, 40), c: "thin" }, { d: R(166, 40, 40, 30), c: "thin" }, { d: R(214, 110, 44, 32), c: "thin" },
        { d: "M150 120a18 18 0 0 1 18 18", c: "thin" }, { d: L(80, 154, 120, 154), c: "thin" }, { d: R(228, 40, 30, 44), c: "thin" }];
    }
    const paths = seq(svg, list, 0, 1, 2.5);
    minis.push({ svg, paths });
    render(paths, 0);
  });
  // Nombres de los espacios en los planos; aparecen cuando termina el trazo
  const ROOMS = {
    lot: [[185, 91, "CASA"], [252, 143, "TERRENO", "end"]],
    flat: [[100, 93, "RECÁMARA"], [100, 131, "BAÑO"], [186, 86, "COCINA"], [190, 134, "SALA"]]
  };
  minis.forEach(m => {
    m.texts = (ROOMS[m.svg.dataset.mini] || []).map(([x, y, t, a]) => {
      const n = mk(m.svg, "text", { x, y, "font-size": 8, "letter-spacing": "1.5", "text-anchor": a || "middle", class: "tmuted" });
      n.textContent = t;
      n.style.transition = "opacity .6s";
      n.style.opacity = reduce ? 1 : 0;
      return n;
    });
  });
  function finishMini(m) {
    m.t = 1; m.done = true;
    render(m.paths, 1);
    m.texts.forEach(n => { n.style.opacity = 1; });
  }
  // Etiquetas de cotas en planta de terreno
  const lotSvg = $('svg[data-mini="lot"]');
  if (lotSvg) {
    const a = mk(lotSvg, "text", { x: 160, y: 12, "text-anchor": "middle", "font-size": 9, "letter-spacing": "1.5", class: "tmuted" }); a.textContent = "FRENTE";
    const b = mk(lotSvg, "text", { x: 292, y: 94, "font-size": 9, "letter-spacing": "1.5", class: "tmuted", transform: "rotate(90 292 94)", "text-anchor": "middle" }); b.textContent = "FONDO";
  }

  // Cada dibujo chico se traza solo cuando aparece en pantalla
  minis.forEach(m => whenVisible(m.svg, () => play(m.paths, 1600, () => finishMini(m))));

  /* ---------- Aparición suave de los bloques ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove("pre");
      io.unobserve(e.target);
    }), { rootMargin: "0px 0px -10% 0px" });
    $$(".rv").forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) el.classList.add("pre");
      io.observe(el);
      whenVisible(el, () => el.classList.remove("pre"));
    });
  }

  /* ---------- Aviso de privacidad ---------- */
  const dlg = $("#privDlg"), privBtn = $("#privBtn");
  if (dlg && privBtn) privBtn.addEventListener("click", () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });

  refreshWa();
  window.AE = { $, $$, reduce, money, clamp, state, MSGS, refreshWa, mk, stroke, R, L, seq, render, play, whenVisible };
})();
