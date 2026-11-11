/* Pantalla Médico: Médica Country (torre, plano interactivo, esquemas, inventario y calculadora) */
(() => {
  const { $, $$, reduce, money, state, MSGS, refreshWa, mk, stroke, R, L, seq, render, play, whenVisible } = AE;
  const RENTA_M2_MIN = 550, RENTA_M2_MAX = 900; // Renta mensual por m² en la zona

  /* ---------- Médica Country: torre de la historia ---------- */
  const tc = $("#tcSvg");
  const tcPaths = [];
  tcPaths.push(stroke(tc, L(16, 600, 384, 600), 0, 0.06, "heavy"));
  const HL_FLOOR = 7, FH = 29; // nivel 9 de 14 niveles tipo
  const hlY = 550 - (HL_FLOOR + 1) * FH;
  const hlRect = mk(tc, "rect", { x: 60, y: hlY, width: 180, height: FH, class: "fillhl" });
  hlRect.style.opacity = 0;
  const tcList = [{ d: R(60, 142, 180, 458), c: "heavy" }, { d: L(60, 550, 240, 550) }, { d: R(128, 566, 44, 34) }, { d: R(80, 122, 140, 20) }];
  for (let f = 0; f < 14; f++) { const y = 550 - (f + 1) * FH; tcList.push({ d: L(60, y, 240, y), c: "thin" }); }
  [96, 132, 168, 204].forEach(x => tcList.push({ d: L(x, 550, x, 142), c: "thin" }));
  tcPaths.push(...seq(tc, tcList, 0.02, 0.5, 3));
  // Señal del consultorio y cota de altura
  tcPaths.push(stroke(tc, R(60, hlY, 180, FH), 0.3, 0.42, "heavy"));
  tcPaths.push(stroke(tc, L(240, hlY + 15, 268, hlY + 15), 0.38, 0.46));
  const tA = mk(tc, "text", { x: 274, y: hlY + 13, "font-size": 11, "letter-spacing": "2", class: "tmuted" }); tA.textContent = "CONSULTORIO";
  const tB = mk(tc, "text", { x: 274, y: hlY + 33, "font-size": 17, "font-weight": 300 }); tB.textContent = "15 a 33 m²";
  [tA, tB].forEach(t => { t.style.transition = "opacity .5s"; t.style.opacity = 0; });
  hlRect.style.transition = "opacity .6s";
  // La torre se dibuja sola al abrir la pantalla y después se marca un consultorio
  render(tcPaths, 0);
  whenVisible(tc, () => play(tcPaths, 2800, () => { hlRect.style.opacity = 1; tA.style.opacity = tB.style.opacity = 1; }));
  /* ---------- Médica Country: plano interactivo ---------- */
  // Las 4 plantas del PDF oficial (polígonos redibujados, m² oficiales) y sus 32 consultorios disponibles
  const MC = {"plans":{"p22":{"name":"Planta tipo 22 consultorios","scale":0.019913074241168786,"slab":[[180,130],[660,130],[660,20],[1210,20],[1210,130],[1620,130],[1620,345],[1780,345],[1780,930],[1620,930],[1620,1000],[180,1000],[180,930],[20,930],[20,345],[180,345]],"core":[[660,20],[1060,20],[1060,355],[1205,355],[1205,505],[660,505]],"terr":[],"amen":null,"units":[{"n":"01","m2":32.62,"t":"especializado","o":"N","int":false,"terraza":false,"pts":[[1060,20],[1210,20],[1210,130],[1335,130],[1335,325],[1265,325],[1265,500],[1210,500],[1210,355],[1060,355]],"c":[1186,225]},{"n":"02","m2":15.05,"t":"start","o":"","int":true,"terraza":false,"pts":[[1265,325],[1485,325],[1485,500],[1265,500]],"c":[1375,412]},{"n":"03","m2":29.91,"t":"especializado","o":"N","int":false,"terraza":false,"pts":[[1335,130],[1620,130],[1620,500],[1485,500],[1485,325],[1335,325]],"c":[1500,283]},{"n":"04","m2":16.31,"t":"start","o":"E","int":false,"terraza":false,"pts":[[1620,345],[1780,345],[1780,570],[1620,570]],"c":[1700,458]},{"n":"05","m2":27.52,"t":"especializado","o":"E","int":false,"terraza":false,"pts":[[1545,575],[1780,565],[1780,930],[1620,930],[1620,795],[1545,795]],"c":[1674,735]},{"n":"06","m2":20.02,"t":"plus","o":"S","int":false,"terraza":false,"pts":[[1405,800],[1620,800],[1620,1000],[1405,1000]],"c":[1512,900]},{"n":"07","m2":15.45,"t":"start","o":"","int":true,"terraza":false,"pts":[[1262,612],[1472,612],[1472,808],[1262,808]],"c":[1367,710]},{"n":"08","m2":18.67,"t":"plus","o":"S","int":false,"terraza":false,"pts":[[1190,808],[1405,808],[1405,1000],[1190,1000]],"c":[1298,904]},{"n":"09","m2":17.82,"t":"plus","o":"S","int":false,"terraza":false,"pts":[[970,845],[1190,845],[1190,1000],[970,1000]],"c":[1080,922]},{"n":"10","m2":15.17,"t":"start","o":"","int":true,"terraza":false,"pts":[[940,650],[1138,650],[1138,845],[940,845]],"c":[1039,748]},{"n":"11","m2":15.17,"t":"start","o":"","int":true,"terraza":false,"pts":[[745,650],[940,650],[940,845],[745,845]],"c":[842,748]},{"n":"12","m2":22.54,"t":"plus","o":"S","int":false,"terraza":false,"pts":[[680,845],[970,845],[970,1000],[680,1000]],"c":[825,922]},{"n":"13","m2":15.59,"t":"start","o":"S","int":false,"terraza":false,"pts":[[465,820],[680,820],[680,1000],[465,1000]],"c":[572,910]},{"n":"14","m2":15.09,"t":"start","o":"","int":true,"terraza":false,"pts":[[472,612],[665,612],[665,820],[472,820]],"c":[568,716]},{"n":"15","m2":18.34,"t":"plus","o":"S","int":false,"terraza":false,"pts":[[180,825],[465,825],[465,1000],[180,1000]],"c":[322,912]},{"n":"16","m2":16.31,"t":"start","o":"","int":true,"terraza":false,"pts":[[180,625],[398,625],[398,825],[180,825]],"c":[289,725]},{"n":"17","m2":23.76,"t":"plus","o":"O","int":false,"terraza":false,"pts":[[20,560],[180,560],[180,930],[20,930]],"c":[100,745]},{"n":"18","m2":16.08,"t":"start","o":"O","int":false,"terraza":false,"pts":[[20,345],[195,345],[195,560],[20,560]],"c":[108,452]},{"n":"19","m2":19.47,"t":"plus","o":"N","int":false,"terraza":false,"pts":[[180,130],[320,130],[320,505],[180,505]],"c":[250,318]},{"n":"20","m2":15.08,"t":"start","o":"N","int":false,"terraza":false,"pts":[[320,130],[465,130],[465,325],[380,325],[380,505],[320,505]],"c":[381,279]},{"n":"21","m2":15.09,"t":"start","o":"","int":true,"terraza":false,"pts":[[380,325],[605,325],[605,505],[380,505]],"c":[492,415]},{"n":"22","m2":20.29,"t":"plus","o":"N","int":false,"terraza":false,"pts":[[465,130],[660,130],[660,505],[605,505],[605,325],[465,325]],"c":[577,266]}],"img":"media/planta-oficial-22.jpg"},"p5":{"name":"Planta tipo 5 consultorios","scale":0.019972120497369808,"slab":[[180,150],[660,150],[660,40],[1200,40],[1200,150],[1620,150],[1620,360],[1780,360],[1780,950],[1620,950],[1620,1024],[180,1024],[180,950],[20,950],[20,360],[180,360]],"core":[[660,40],[1200,40],[1200,680],[660,680]],"terr":[],"amen":null,"units":[{"n":"01","m2":100.76,"t":"clinica","o":"N E","int":false,"terraza":false,"pts":[[1200,150],[1620,150],[1620,360],[1780,360],[1780,586],[1200,586]],"c":[1458,385]},{"n":"02","m2":93.07,"t":"clinica","o":"S E","int":false,"terraza":false,"pts":[[1200,586],[1780,586],[1780,950],[1620,950],[1620,1024],[1200,1024]],"c":[1480,796]},{"n":"03","m2":70.94,"t":"clinica","o":"S","int":false,"terraza":false,"pts":[[660,680],[1200,680],[1200,1024],[660,1024]],"c":[930,852]},{"n":"04","m2":105.03,"t":"clinica","o":"S O","int":false,"terraza":false,"pts":[[20,586],[660,586],[660,1024],[180,1024],[180,950],[20,950]],"c":[351,797]},{"n":"05","m2":94.54,"t":"clinica","o":"N O","int":false,"terraza":false,"pts":[[180,150],[660,150],[660,586],[20,586],[20,360],[180,360]],"c":[373,383]}],"img":"media/planta-oficial-5.jpg"},"p2":{"name":"Planta tipo 2 consultorios con terraza","scale":0.01934193484693092,"slab":[[180,150],[660,150],[660,40],[1200,40],[1200,150],[1620,150],[1620,360],[1780,360],[1780,950],[1620,950],[1620,1024],[180,1024],[180,950],[20,950],[20,360],[180,360]],"core":[[660,40],[1200,40],[1200,680],[660,680]],"terr":[[[180,150],[660,150],[660,360],[180,360]],[[1200,150],[1620,150],[1620,360],[1200,360]],[[180,950],[1620,950],[1620,1024],[180,1024]]],"amen":null,"units":[{"n":"01","m2":151.6,"t":"clinica","o":"E","int":false,"terraza":true,"pts":[[1200,360],[1780,360],[1780,950],[974,950],[974,680],[1200,680]],"c":[1429,679]},{"n":"02","m2":175.05,"t":"clinica","o":"O","int":false,"terraza":true,"pts":[[20,360],[660,360],[660,680],[974,680],[974,950],[20,950]],"c":[427,684]}],"img":"media/planta-oficial-2.jpg"},"n2":{"name":"Planta tipo 3 consultorios + amenidades","scale":0.019972120497369808,"slab":[[180,150],[660,150],[660,40],[1200,40],[1200,150],[1620,150],[1620,360],[1780,360],[1780,950],[1620,950],[1620,1024],[180,1024],[180,950],[20,950],[20,360],[180,360]],"core":[[660,40],[1200,40],[1200,680],[660,680]],"terr":[],"amen":{"pts":[[1200,150],[1620,150],[1620,360],[1780,360],[1780,950],[1620,950],[1620,1024],[1200,1024]],"c":[1490,600],"label":"Amenidades","sub":"193.83 m²"},"units":[{"n":"01","m2":70.94,"t":"clinica","o":"S","int":false,"terraza":false,"pts":[[660,680],[1200,680],[1200,1024],[660,1024]],"c":[930,852]},{"n":"02","m2":105.03,"t":"clinica","o":"S O","int":false,"terraza":false,"pts":[[20,586],[660,586],[660,1024],[180,1024],[180,950],[20,950]],"c":[351,797]},{"n":"03","m2":94.54,"t":"clinica","o":"N O","int":false,"terraza":false,"pts":[[180,150],[660,150],[660,586],[20,586],[20,360],[180,360]],"c":[373,383]}],"img":"media/planta-oficial-3amen.jpg"}},"floors":[{"f":"p22","plan":"p22","label":"22 consultorios","name":"Planta de 22 consultorios","note":""},{"f":"p5","plan":"p5","label":"5 consultorios","name":"Planta de 5 consultorios","note":""},{"f":"n2","plan":"n2","label":"3 + amenidades","name":"Planta de 3 consultorios y amenidades","note":"Incluye el área de amenidades de 193.83 m²."},{"f":"p2","plan":"p2","label":"2 con terraza","name":"Planta de 2 consultorios con terraza","note":"Consultorios con terraza."}],"inv":[{"id":"01","piso":"p22","ord":1,"num":"01","tipo":"especializado","m2":32.62,"orient":"N","ventana":"Sí","terraza":"No","precio":2424547},{"id":"02","piso":"p22","ord":2,"num":"02","tipo":"start","m2":15.05,"orient":"","ventana":"No (interior)","terraza":"No","precio":1223399},{"id":"03","piso":"p22","ord":3,"num":"03","tipo":"especializado","m2":29.91,"orient":"N","ventana":"Sí","terraza":"No","precio":2223121},{"id":"04","piso":"p22","ord":4,"num":"04","tipo":"start","m2":16.31,"orient":"E","ventana":"Sí","terraza":"No","precio":1325824},{"id":"05","piso":"p22","ord":5,"num":"05","tipo":"especializado","m2":27.52,"orient":"E","ventana":"Sí","terraza":"No","precio":2045479},{"id":"06","piso":"p22","ord":6,"num":"06","tipo":"plus","m2":20.02,"orient":"S","ventana":"Sí","terraza":"No","precio":1562441},{"id":"07","piso":"p22","ord":7,"num":"07","tipo":"start","m2":15.45,"orient":"","ventana":"No (interior)","terraza":"No","precio":1255915},{"id":"08","piso":"p22","ord":8,"num":"08","tipo":"plus","m2":18.67,"orient":"S","ventana":"Sí","terraza":"No","precio":1457081},{"id":"09","piso":"p22","ord":9,"num":"09","tipo":"plus","m2":17.82,"orient":"S","ventana":"Sí","terraza":"No","precio":1390744},{"id":"10","piso":"p22","ord":10,"num":"10","tipo":"start","m2":15.17,"orient":"","ventana":"No (interior)","terraza":"No","precio":1233154},{"id":"11","piso":"p22","ord":11,"num":"11","tipo":"start","m2":15.17,"orient":"","ventana":"No (interior)","terraza":"No","precio":1233154},{"id":"12","piso":"p22","ord":12,"num":"12","tipo":"plus","m2":22.54,"orient":"S","ventana":"Sí","terraza":"No","precio":1759112},{"id":"13","piso":"p22","ord":13,"num":"13","tipo":"start","m2":15.59,"orient":"S","ventana":"Sí","terraza":"No","precio":1267296},{"id":"14","piso":"p22","ord":14,"num":"14","tipo":"start","m2":15.09,"orient":"","ventana":"No (interior)","terraza":"No","precio":1226651},{"id":"15","piso":"p22","ord":15,"num":"15","tipo":"plus","m2":18.34,"orient":"S","ventana":"Sí","terraza":"No","precio":1431327},{"id":"16","piso":"p22","ord":16,"num":"16","tipo":"start","m2":16.31,"orient":"","ventana":"No (interior)","terraza":"No","precio":1325824},{"id":"17","piso":"p22","ord":17,"num":"17","tipo":"plus","m2":23.76,"orient":"O","ventana":"Sí","terraza":"No","precio":1854325},{"id":"18","piso":"p22","ord":18,"num":"18","tipo":"start","m2":16.08,"orient":"O","ventana":"Sí","terraza":"No","precio":1307127},{"id":"19","piso":"p22","ord":19,"num":"19","tipo":"plus","m2":19.47,"orient":"N","ventana":"Sí","terraza":"No","precio":1519517},{"id":"20","piso":"p22","ord":20,"num":"20","tipo":"start","m2":15.08,"orient":"N","ventana":"Sí","terraza":"No","precio":1225838},{"id":"21","piso":"p22","ord":21,"num":"21","tipo":"start","m2":15.09,"orient":"","ventana":"No (interior)","terraza":"No","precio":1226651},{"id":"22","piso":"p22","ord":22,"num":"22","tipo":"plus","m2":20.29,"orient":"N","ventana":"Sí","terraza":"No","precio":1583513},{"id":"01","piso":"p5","ord":101,"num":"01","tipo":"clinica","m2":100.76,"orient":"N E","ventana":"Sí","terraza":"No","precio":6535797},{"id":"02","piso":"p5","ord":102,"num":"02","tipo":"clinica","m2":93.07,"orient":"S E","ventana":"Sí","terraza":"No","precio":6036986},{"id":"03","piso":"p5","ord":103,"num":"03","tipo":"clinica","m2":70.94,"orient":"S","ventana":"Sí","terraza":"No","precio":4601523},{"id":"04","piso":"p5","ord":104,"num":"04","tipo":"clinica","m2":105.03,"orient":"S O","ventana":"Sí","terraza":"No","precio":6812771},{"id":"05","piso":"p5","ord":105,"num":"05","tipo":"clinica","m2":94.54,"orient":"N O","ventana":"Sí","terraza":"No","precio":6132337},{"id":"01","piso":"n2","ord":201,"num":"01","tipo":"clinica","m2":70.94,"orient":"S","ventana":"Sí","terraza":"No","precio":4601523},{"id":"02","piso":"n2","ord":202,"num":"02","tipo":"clinica","m2":105.03,"orient":"S O","ventana":"Sí","terraza":"No","precio":6812771},{"id":"03","piso":"n2","ord":203,"num":"03","tipo":"clinica","m2":94.54,"orient":"N O","ventana":"Sí","terraza":"No","precio":6132337},{"id":"01","piso":"p2","ord":301,"num":"01","tipo":"clinica","m2":151.6,"orient":"E","ventana":"Sí","terraza":"Sí","precio":9833534},{"id":"02","piso":"p2","ord":302,"num":"02","tipo":"clinica","m2":175.05,"orient":"O","ventana":"Sí","terraza":"Sí","precio":11354618}]};
  // Precio por m² según superficie (lista de Diego, nov. 2026)
  const TYPES = {
    start: { name: "Consultorio Start", short: "Start", tipo: "Tipo 1", rango: "Menos de 17 m²", pm2: 81289, spec: "Medicina general y consulta", col: "#6F6F6C", txt: "#F5F5F3" },
    plus: { name: "Consultorio Plus", short: "Plus", tipo: "Tipo 2", rango: "17 a 24 m²", pm2: 78044, spec: "Consulta con área de exploración", col: "#A9A9A6", txt: "#111111" },
    especializado: { name: "Consultorio Especializado", short: "Especializado", tipo: "Tipo 3", rango: "25 a 33 m²", pm2: 74327, spec: "Odontología y procedimientos", col: "#D6D6D3", txt: "#111111" },
    clinica: { name: "Clínica Integral", short: "Clínica", tipo: "Tipo 4", rango: "34 m² o más", pm2: 64865, spec: "Clínica multiespecialidad", col: "#F5F5F3", txt: "#111111" }
  };
  const ORI = { N: "norte", S: "sur", E: "oriente", O: "poniente" };
  const VIEW = {
    O: "Vista al poniente: campo de golf del Country Club y, al fondo, la Sierra de la Primavera.",
    N: "Vista al norte: la ciudad hacia Zapopan y cerros en el horizonte.",
    E: "Vista al oriente: Jardines del Country, arbolado y cerros al noreste.",
    S: "Vista al sur: Lomas del Country; una torre vecina cercana cubre parte de la vista."
  };
  // Formas de consultorio con imágenes ilustrativas (vista superior, ángulos, obra gris) y recorrido en video
  const SHP = {
    start: { name: "Start de frente ancho", ang: ["a1", "a2", "a3"], tour: "start", f: k => "media/start_" + k + ".jpg" },
    plus: { name: "Plus de fachada larga", ang: ["a1", "a2", "a3"], tour: "plus", f: k => "media/plus_" + k + ".jpg" },
    esp: { name: "Especializado rectangular", ang: ["a1", "a2", "a3"], tour: "esp", f: k => "media/esp_" + k + ".jpg" },
    cli: { name: "Clínica de esquina", ang: ["a1", "a2", "a3"], tour: "cli", f: k => "media/cli_" + k + ".jpg" },
    start_angosto: { name: "Consultorio angosto y profundo", ang: ["a1", "a2"] },
    start_interior: { name: "Consultorio interior, sin ventana", ang: ["a1", "a2"], alt: { a2: "media/start_interior.jpg" } },
    plus_l: { name: "Consultorio en L con pasillo de acceso", ang: ["a1", "a2"] },
    esp_l1: { name: "Especializado en L con privado", ang: ["a1", "a2"] },
    esp_l2: { name: "Especializado en L de esquina", ang: ["a1", "a2"] },
    cli_67: { name: "Clínica de una fachada", ang: ["a1", "a2"] },
    cli_terraza: { name: "Clínica con terraza", ang: ["a1"] }
  };
  const PLANS = [
    { k: "contado", n: "Contado", f: .90, o: 0, e: .10, d: .17 },
    { k: "semi", n: "Semicontado", f: .30, o: .70, e: 0, d: .12 },
    { k: "semi2", n: "Semicontado 2", f: .50, o: 0, e: .50, d: .10 },
    { k: "fin1", n: "Financiamiento 1", f: .30, o: .30, e: .40, d: .07 },
    { k: "fin2", n: "Financiamiento 2", f: .20, o: .20, e: .60, d: .04 },
    { k: "fin3", n: "Financiamiento 3", f: .10, o: .20, e: .70, d: .02 }
  ];
  // Del sistema de coordenadas de los polígonos al de la planta oficial (imagen de 1998 × 1293)
  const OFI = { p22: "0.8969 0 0 0.904 192.1 158.2", other: "0.8969 0 0 0.9004 192.1 140.3" };
  const pct = x => Math.round(x * 100) + "%";
  const pts = a => a.map(p => p.join(",")).join(" ");
  let mcFloor = MC.floors[0], mcUnit = null, mcMode = "top", mcShot = "a1", mcView = "dib";
  state.scheme = "fin1";
  // Meses de obra desde la firma (en una semana) hasta noviembre de 2029
  const OBRA_MESES = (() => { const d = new Date(); d.setDate(d.getDate() + 7); return Math.max(1, (2029 - d.getFullYear()) * 12 + (10 - d.getMonth())); })();

  function mcInv() { return MC.inv.find(i => i.piso === mcFloor.f && i.num === mcUnit.n); }
  function unitLabel(i) { return (i.tipo === "clinica" ? "Clínica " : "Consultorio ") + i.id; }
  function planName(i) { return MC.floors.find(f => f.f === i.piso).name; }
  function shapeOf(u) {
    const pk = mcFloor.plan, n = u.n;
    if (pk === "p22") {
      if (["19", "20"].includes(n)) return "start_angosto";
      if (u.int) return "start_interior";
      if (n === "22") return "plus_l";
      if (n === "01") return "esp_l1";
      if (n === "03") return "esp_l2";
      return u.t === "especializado" ? "esp" : u.t === "plus" ? "plus" : "start";
    }
    if (pk === "p2") return "cli_terraza";
    if ((pk === "p5" && n === "03") || (pk === "n2" && n === "01")) return "cli_67";
    return "cli";
  }
  // Recorte de la planta oficial ambientada alrededor de un consultorio, con su contorno punteado
  function ofiCrop(u, pad = 28) {
    const pl = MC.plans[mcFloor.plan];
    const m = (mcFloor.plan === "p22" ? OFI.p22 : OFI.other).split(" ").map(Number);
    const P = u.pts.map(([x, y]) => [m[0] * x + m[4], m[3] * y + m[5]]);
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    let W = x1 - x0, H = y1 - y0;
    if (W / H > 1.5) H = W / 1.5; else W = H * 1.5; // recuadro 3:2
    const vb = [cx - W / 2, cy - H / 2, W, H].map(v => v.toFixed(1)).join(" ");
    const poly = P.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Planta oficial ambientada"><image href="${pl.img}" width="1998" height="1293"/><polygon points="${poly}" fill="rgba(17,17,17,.06)" stroke="#111" stroke-width="3" stroke-dasharray="10 6"/></svg>`;
  }
  // Consultorios con recorrido 3D caminable
  const REC = { "p22:01": { href: "recorrido-01.html", base: "01" }, "p22:02": { href: "recorrido-02.html", base: "02" }, "p22:03": { href: "recorrido-03.html", base: "03" }, "p22:04": { href: "recorrido-04.html", base: "04" }, "p22:05": { href: "recorrido-05.html", base: "05" }, "p22:06": { href: "recorrido-06.html", base: "06" }, "p22:07": { href: "recorrido-07.html", base: "07" }, "p22:08": { href: "recorrido-08.html", base: "08" }, "p22:09": { href: "recorrido-09.html", base: "09" }, "p22:10": { href: "recorrido-10.html", base: "10" }, "p22:11": { href: "recorrido-11.html", base: "11" }, "p22:12": { href: "recorrido-12.html", base: "12" }, "p22:13": { href: "recorrido-13.html", base: "13" }, "p22:14": { href: "recorrido-14.html", base: "14" }, "p22:15": { href: "recorrido-15.html", base: "15" }, "p22:16": { href: "recorrido-16.html", base: "16" }, "p22:17": { href: "recorrido-17.html", base: "17" }, "p22:18": { href: "recorrido-18.html", base: "18" }, "p22:19": { href: "recorrido-19.html", base: "19" }, "p22:20": { href: "recorrido-20.html", base: "20" }, "p22:21": { href: "recorrido-21.html", base: "21" }, "p22:22": { href: "recorrido-22.html", base: "22" } };
  const recOf = u => REC[mcFloor.plan + ":" + u.n];
  let mcAuto = false;
  function sf(sh, k) { const o = SHP[sh]; if (o.f) return o.f(k); if (o.alt && o.alt[k]) return o.alt[k]; return "media/" + sh + "_" + k + ".jpg"; }

  function mcRenderFloors() {
    $("#mcFloors").innerHTML = MC.floors.map(f => `<button type="button" class="fbtn" aria-pressed="${f === mcFloor}" data-f="${f.f}" aria-label="${f.name}">${f.label}</button>`).join("");
    $$("#mcFloors button").forEach(b => b.onclick = () => mcGoFloor(b.dataset.f));
  }
  function mcGoFloor(f, n) {
    mcFloor = MC.floors.find(x => x.f === f);
    mcRenderFloors(); mcRenderPlan();
    const pl = MC.plans[mcFloor.plan];
    mcSelect(n ? pl.units.find(u => u.n === n) : (pl.units.find(u => u.n === "09") || pl.units[0]));
  }
  function mcRenderPlan() {
    const pl = MC.plans[mcFloor.plan], svg = $("#mcPlan");
    $("#mcNote").textContent = `${mcFloor.name}. ${mcFloor.note ? mcFloor.note + " " : ""}Superficies de la planta oficial; distribución ambientada como ejemplo.`;
    $("#mcPlanWrap").classList.toggle("ofi", mcView === "ofi");
    const label = (u, i) => `${unitLabel(i)}, ${TYPES[u.t].short}, ${u.m2} m²`;
    const invOf = u => MC.inv.find(i => i.piso === mcFloor.f && i.num === u.n);
    let h = "";
    if (mcView === "ofi") {
      svg.setAttribute("viewBox", "0 0 1998 1293");
      h += `<image href="${pl.img}" x="0" y="0" width="1998" height="1293"/>`;
      h += `<g transform="matrix(${mcFloor.plan === "p22" ? OFI.p22 : OFI.other})">` + pl.units.map(u =>
        `<polygon class="uo" tabindex="0" role="button" data-n="${u.n}" aria-label="${label(u, invOf(u))}" points="${pts(u.pts)}"><title>${label(u, invOf(u))}</title></polygon>`).join("") + "</g>";
    } else {
      svg.setAttribute("viewBox", "-60 0 1900 1100");
      h += `<defs><pattern id="hatchI" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="#111" stroke-width="3" stroke-opacity=".45"/></pattern></defs>`;
      h += `<polygon points="${pts(pl.slab)}" fill="var(--paper)" stroke="var(--line)" stroke-width="6"/>`;
      pl.terr.forEach(t => {
        const xs = t.map(p => p[0]), ys = t.map(p => p[1]);
        h += `<polygon points="${pts(t)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="10 8"/><text x="${(Math.min(...xs) + Math.max(...xs)) / 2}" y="${(Math.min(...ys) + Math.max(...ys)) / 2 + 9}" text-anchor="middle" font-size="24" fill="var(--muted)" letter-spacing="4">TERRAZA</text>`;
      });
      const cx = pl.core.map(p => p[0]), cy = pl.core.map(p => p[1]), ccx = (Math.min(...cx) + Math.max(...cx)) / 2 - 40, ccy = (Math.min(...cy) + Math.max(...cy)) / 2;
      h += `<polygon points="${pts(pl.core)}" fill="#1E1E1D" stroke="var(--line)" stroke-width="3"/><text x="${ccx}" y="${ccy}" text-anchor="middle" font-size="24" fill="var(--muted)" letter-spacing="3">NÚCLEO</text><text x="${ccx}" y="${ccy + 32}" text-anchor="middle" font-size="20" fill="var(--muted)">elevadores, escaleras y baños</text>`;
      if (pl.amen) h += `<polygon points="${pts(pl.amen.pts)}" fill="url(#hatchA)" stroke="var(--muted)" stroke-width="3"/><defs><pattern id="hatchA" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#1A1A19"/><line x1="0" y1="0" x2="0" y2="18" stroke="#2E2E2C" stroke-width="3"/></pattern></defs><text x="${pl.amen.c[0]}" y="${pl.amen.c[1]}" text-anchor="middle" font-size="34" fill="var(--ink)" letter-spacing="4">${pl.amen.label.toUpperCase()}</text><text x="${pl.amen.c[0]}" y="${pl.amen.c[1] + 36}" text-anchor="middle" font-size="24" fill="var(--muted)">${pl.amen.sub}</text>`;
      h += pl.units.map(u => `<polygon class="u" tabindex="0" role="button" data-n="${u.n}" aria-label="${label(u, invOf(u))}" points="${pts(u.pts)}" fill="${TYPES[u.t].col}"><title>${label(u, invOf(u))}</title></polygon>` +
        (u.int ? `<polygon points="${pts(u.pts)}" fill="url(#hatchI)" pointer-events="none"/>` : "")).join("");
      h += pl.units.map(u => `<text class="ul" data-n="${u.n}" x="${u.c[0]}" y="${u.c[1] - 4}" text-anchor="middle" font-size="32" font-weight="500" fill="${TYPES[u.t].txt}">${invOf(u).id}</text><text class="ul" data-n="${u.n}" x="${u.c[0]}" y="${u.c[1] + 26}" text-anchor="middle" font-size="22" fill="${TYPES[u.t].txt}">${u.m2} m²</text>`).join("");
      const bar = 5 / pl.scale;
      h += `<g transform="translate(40,1062)"><rect width="${bar}" height="8" fill="var(--ink)"/><text y="-10" font-size="20" fill="var(--muted)">0</text><text x="${bar}" y="-10" font-size="20" text-anchor="middle" fill="var(--muted)">5 m</text></g>`;
      h += `<g transform="translate(1700,1052)"><path d="M0,-34 L12,0 L0,-8 L-12,0Z" fill="var(--ink)"/><text x="22" y="-6" font-size="24" fill="var(--ink)">N</text></g>`;
      h += `<text x="910" y="1082" text-anchor="middle" font-size="20" fill="var(--muted)" letter-spacing="3">SUR · CALLE MAR MÁRMARA</text><text x="1815" y="560" font-size="20" fill="var(--muted)" text-anchor="middle" letter-spacing="3" transform="rotate(90 1815 560)">ORIENTE</text><text x="-28" y="560" font-size="20" fill="var(--muted)" text-anchor="middle" letter-spacing="3" transform="rotate(-90 -28 560)">PONIENTE · AV. CIRCUNVALACIÓN</text>`;
    }
    svg.innerHTML = h;
    $$("#mcPlan [role=button]").forEach(p => {
      const go = () => mcSelect(pl.units.find(u => u.n === p.dataset.n));
      p.onclick = go;
      p.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
    });
    if (mcUnit) $$("#mcPlan [data-n]").forEach(p => p.classList.toggle("sel", p.dataset.n === mcUnit.n));
  }
  function mcSelect(u) {
    if (!u) return;
    mcUnit = u; mcShot = "a1";
    $$("#mcPlan [data-n]").forEach(p => p.classList.toggle("sel", p.dataset.n === u.n));
    const t = TYPES[u.t], i = mcInv();
    const ori = u.o ? u.o.split(" ").map(o => ORI[o]).join(", ") : "";
    $("#mcFloor").textContent = `${mcFloor.name} · ${t.tipo}`;
    $("#mcName").textContent = unitLabel(i);
    $("#mcTags").innerHTML = `<span class="tagc">${t.name}</span>` + (u.int ? `<span class="tagc">Interior, sin ventana</span>` : `<span class="tagc">Ventana al ${ori}</span>`) + (u.terraza ? `<span class="tagc">Con terraza</span>` : "");
    $("#mcData").innerHTML = [["Superficie", u.m2.toFixed(2) + " m²"], ["Precio de lista", money(i.precio)], ["Precio por m²", money(t.pm2) + " · " + t.rango.toLowerCase()], ["Uso de referencia", t.spec]]
      .map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("");
    $("#mcViewTxt").textContent = u.int
      ? "Consultorio interior con acceso desde el pasillo; se ilumina con luz artificial."
      : VIEW[u.o.split(" ")[0]];
    // Si el consultorio tiene recorrido 3D, la ficha abre directo en esa pestaña
    if (recOf(u)) { mcMode = "tour"; mcAuto = true; } else if (mcAuto) { mcMode = "top"; mcAuto = false; }
    if (recOf(u)) $("#mcTags").insertAdjacentHTML("beforeend", `<span class="tagc">Recorrido 3D</span>`);
    mcRenderModes(); mcRenderPay();
    onUnit(i);
  }
  function mcRenderModes() {
    const M = [["top", "Desde arriba"], ["angles", "Ángulos"], ["tour", "Recorrido"], ["ba", "Obra gris vs. terminado"]];
    $("#mcModes").innerHTML = M.map(x => `<button type="button" class="chip" aria-pressed="${mcMode === x[0]}" data-m="${x[0]}">${x[1]}</button>`).join("");
    $$("#mcModes button").forEach(b => b.onclick = () => { mcMode = b.dataset.m; mcRenderModes(); });
    const sh = shapeOf(mcUnit), o = SHP[sh], b = $("#mcModeBody");
    // Las imágenes del consultorio angosto muestran la ventana lateral del 19; el 20 no la tiene
    const side = sh === "start_angosto" && mcUnit.n !== "19" ? " Las imágenes muestran una ventana lateral que este consultorio no tiene." : "";
    const cap = `<p class="caption">Forma de ejemplo: ${o.name.toLowerCase()}. Imagen ilustrativa.${side}`;
    if (mcMode === "top") {
      b.innerHTML = `<div class="stage top crop">${ofiCrop(mcUnit)}</div><p class="caption">Planta oficial ambientada. La línea punteada marca el ${unitLabel(mcInv())}; la distribución es un ejemplo.</p>`;
    } else if (mcMode === "angles") {
      const angleImage = shot => {
        if (mcFloor.plan === "p22" && mcUnit.n === "17") {
          return `media/consultorio-17-${shot}.jpg`;
        }
        return sf(sh, shot);
      };
      if (!o.ang.includes(mcShot)) mcShot = o.ang[0];
      b.innerHTML = `<div class="stage"><img src="${angleImage(mcShot)}" alt="${o.name}"></div><div class="thumbs">${o.ang.map(s => `<button type="button" aria-pressed="${s === mcShot}" data-s="${s}" aria-label="Ángulo ${s.slice(1)}"><img src="${angleImage(s)}" alt=""></button>`).join("")}</div>${cap}</p>`;
      $$("#mcModeBody .thumbs button").forEach(x => x.onclick = () => { mcShot = x.dataset.s; mcRenderModes(); });
    } else if (mcMode === "tour" && recOf(mcUnit)) {
      const r = recOf(mcUnit), same = r.base !== mcUnit.n;
      b.innerHTML = `<div class="stage rec3d"><img src="${sf(sh, "a1")}" alt=""><div class="rec3d-in"><p class="pill">Recorrido 3D</p><b>Camine el consultorio ${r.base}</b><p>En primera persona, como en un videojuego: con flechas o W A S D en computadora y con joystick en el celular.${same ? ` El ${unitLabel(mcInv())} tiene la misma superficie y forma.` : ""}</p><a class="btn solid" href="${r.href}">Entrar al recorrido <span class="arr">→</span></a></div></div>`;
    } else if (mcMode === "tour") {
      b.innerHTML = o.tour
        ? `<div class="stage"><video src="media/rec_${o.tour}.mp4" autoplay muted loop playsinline controls></video></div>${cap} Recorrido de 8 segundos.</p>`
        : `<div class="stage empty"><div><b>Recorrido en preparación</b><p class="caption">Esta forma de consultorio aún no tiene video. Puede verlo en otro consultorio de la misma planta.</p></div></div>`;
    } else {
      b.innerHTML = `<div class="stage ba" id="mcBa"><img src="${sf(sh, "a1")}" alt="Terminado"><img class="before" src="${sf(sh, "gris")}" alt="Obra gris"><div class="handle"></div><span class="btag l">Obra gris</span><span class="btag r">Terminado</span><input type="range" min="0" max="100" value="50" id="mcBaR" aria-label="Comparar obra gris y terminado"></div>${cap} Deslice la línea: así se entrega y así puede quedar.</p>`;
      $("#mcBaR").oninput = e => $("#mcBa").style.setProperty("--pos", e.target.value + "%");
    }
  }
  function quote(p, L) {
    const F = Math.round(L * (1 - p.d));
    return { F, save: L - F, firma: F * p.f, obra: F * p.o, mes: F * p.o / OBRA_MESES, esc: F * p.e };
  }
  function mcRenderPay() {
    const i = mcInv(), L = i.precio;
    $("#mcPayT").textContent = `${unitLabel(i)} · ${i.m2} m² · precio de lista ${money(L)}`;
    $("#mcPay").innerHTML = PLANS.map(p => {
      const c = quote(p, L);
      return `<tr class="${p.k === state.scheme ? "sel" : ""}" data-k="${p.k}" tabindex="0"><td><b>${p.n}</b><span class="sub">${pct(p.f)} firma · ${pct(p.o)} obra · ${pct(p.e)} escritura</span></td><td>${pct(p.d)}<span class="sub">−${money(c.save)}</span></td><td><b>${money(c.F)}</b></td><td>${money(c.firma)}</td><td>${p.o ? money(c.obra) + `<span class="sub">≈ ${money(c.mes)} al mes · ${OBRA_MESES} meses</span>` : "—"}</td><td>${p.e ? money(c.esc) : "—"}</td></tr>`;
    }).join("");
    $$("#mcPay tr").forEach(r => {
      const go = () => { state.scheme = r.dataset.k; mcRenderPay(); refreshWa(); };
      r.onclick = go;
      r.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
    });
  }
  function mcRenderTypes() {
    $("#mcTypes").innerHTML = Object.entries(TYPES).map(([k, t]) => {
      const xs = MC.inv.filter(i => i.tipo === k), min = Math.min(...xs.map(i => i.precio));
      return `<article class="tcard"><span class="sw" style="background:${t.col}"></span><p class="tag">${t.tipo} · ${t.rango}</p><h4>${t.name}</h4><p class="big">${money(t.pm2)}<small> / m²</small></p><p>Desde ${money(min)}. ${t.spec}.</p><button type="button" class="link-btn" data-t="${k}">Ver en el plano</button></article>`;
    }).join("");
    $$("#mcTypes button").forEach(b => b.onclick = () => {
      const i = MC.inv.find(x => x.tipo === b.dataset.t);
      mcGoFloor(i.piso, i.num); $("#plano").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
    $("#mcLegend").innerHTML = Object.values(TYPES).map(t => `<span><i style="background:${t.col}"></i>${t.short} · ${t.rango}</span>`).join("") + `<span><i class="int"></i>Interior, sin ventana</span>`;
  }
  // Inventario con filtros y orden
  let sortK = "id", sortDir = 1;
  MC.floors.forEach(f => $("#fPiso").insertAdjacentHTML("beforeend", `<option value="${f.f}">${f.name}</option>`));
  function mcRenderInv() {
    const fp = $("#fPiso").value, ft = $("#fTipo").value, fv = $("#fVent").value, fo = $("#fOri").value;
    const rows = MC.inv.filter(i => (!fp || i.piso == fp) && (!ft || i.tipo === ft) && (!fv || i.ventana === fv) && (!fo || i.orient.split(" ").includes(fo)));
    rows.sort((a, b) => {
      let x = a[sortK], y = b[sortK];
      if (sortK === "id" || sortK === "piso") { x = a.ord; y = b.ord; }
      return (x > y ? 1 : x < y ? -1 : 0) * sortDir;
    });
    $("#invSum").textContent = `${rows.length} consultorios · ${rows.reduce((s, i) => s + i.m2, 0).toFixed(0)} m²`;
    $("#invTb").innerHTML = rows.map(i => `<tr data-p="${i.piso}" data-n="${i.num}" tabindex="0"><td>${unitLabel(i)}</td><td>${MC.floors.find(f => f.f === i.piso).label}</td><td><span class="dot" style="background:${TYPES[i.tipo].col}"></span>${TYPES[i.tipo].short}</td><td class="r">${i.m2.toFixed(2)}</td><td>${i.orient ? i.orient.split(" ").map(o => ORI[o]).join(", ") : "—"}</td><td>${i.ventana}</td><td class="r">${money(i.precio)}</td></tr>`).join("");
    $$("#invTb tr").forEach(r => {
      const go = () => { mcGoFloor(r.dataset.p, r.dataset.n); $("#plano").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); };
      r.onclick = go;
      r.onkeydown = e => { if (e.key === "Enter") go(); };
    });
  }
  ["fPiso", "fTipo", "fVent", "fOri"].forEach(id => $("#" + id).onchange = mcRenderInv);
  $$(".it th[data-k]").forEach(th => th.onclick = () => { const k = th.dataset.k; sortDir = sortK === k ? -sortDir : 1; sortK = k; mcRenderInv(); });
  $$("#mcViewSw button").forEach(b => b.onclick = () => {
    mcView = b.dataset.v;
    $$("#mcViewSw button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    mcRenderPlan();
  });

  /* ---------- Calculadora: renta vs. compra del consultorio elegido ---------- */
  const rent = $("#rent");
  const bars = $$("#bars .bar"), priceLine = $("#priceLine");
  // $1,392,000 → "$1.39 M"; $696,000 → "$696 mil"
  const short = n => n >= 1e6 ? "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " M" : "$" + Math.round(n / 1000) + " mil";
  function avgRent(m) { return Math.round(m * (RENTA_M2_MIN + RENTA_M2_MAX) / 2 / 100) * 100; }
  function onUnit(i) {
    state.unit = i;
    if (!state.rentEdited) { state.rent = avgRent(i.m2); rent.value = state.rent; }
    $("#cuName").textContent = unitLabel(i);
    $("#cuMeta").textContent = `${TYPES[i.tipo].short} · ${i.m2} m² · ${planName(i)}`;
    $("#cuImg").innerHTML = ofiCrop(mcUnit, 18);
    calc();
  }
  function calc() {
    const i = state.unit; if (!i) return;
    const m = i.m2, r = Math.max(0, state.rent), price = i.precio, year = r * 12;
    $("#rPrice").textContent = money(price);
    $("#rYear").textContent = money(year);
    $("#rYears").textContent = year > 0 ? (price / year).toFixed(1) : "—";
    $("#rText").textContent = year > 0
      ? `de renta equivalen al precio de lista del ${unitLabel(i)} (${m} m²).`
      : "Ingrese su renta mensual para calcular.";
    $("#rentHint").textContent = `Referencia de mercado en la zona Country: de ${money(RENTA_M2_MIN)} a ${money(RENTA_M2_MAX)} por m² al mes (${money(m * RENTA_M2_MIN)} a ${money(m * RENTA_M2_MAX)} para ${m} m²).`;
    const totals = [5, 10, 15].map(n => year * n);
    const top = Math.max(price, ...totals) * 1.12 || 1;
    bars.forEach((b, k) => {
      b.style.height = (totals[k] / top * 100) + "%";
      b.classList.toggle("over", totals[k] >= price);
      b.firstElementChild.textContent = short(totals[k]);
    });
    priceLine.style.bottom = (price / top * 100) + "%";
    refreshWa();
  }
  rent.addEventListener("input", () => { state.rentEdited = true; state.rent = +rent.value || 0; calc(); });
  $("#rentAvg").addEventListener("click", () => { state.rentEdited = false; if (state.unit) onUnit(state.unit); });

  mcRenderTypes(); mcRenderFloors(); mcRenderPlan(); mcRenderInv();
  mcSelect(MC.plans[mcFloor.plan].units.find(u => u.n === "09"));

  MSGS.unit = () => { const i = state.unit; if (!i) return MSGS.consultorio(); const p = PLANS.find(x => x.k === state.scheme); return `Hola, me interesa el ${unitLabel(i)} de Médica Country (${planName(i).toLowerCase()}, ${TYPES[i.tipo].short}, ${i.m2} m², precio de lista ${money(i.precio)}). ¿Me podrían compartir la cotización oficial con el esquema ${p.n}?`; };
  MSGS.calc = () => { const i = state.unit; if (!i) return MSGS.consultorio(); return `Hola, me interesa el ${unitLabel(i)} de Médica Country (${planName(i).toLowerCase()}, ${i.m2} m²). Actualmente pago ${money(state.rent)} de renta mensual. ¿Me podrían compartir un análisis completo?`; };
  refreshWa();
})();
