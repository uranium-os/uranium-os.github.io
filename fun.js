// easter eggs
(function () {
  var buf = "", ki = 0, ac, clicks = 0, ct = 0, K = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var st = document.createElement("style");
  st.textContent = "html.rad body{filter:hue-rotate(62deg) saturate(1.3);transition:filter .6s}" +
    "html.haz body{filter:grayscale(1) contrast(1.15);outline:3px dashed #888;outline-offset:-6px}" +
    ".egt{position:fixed;right:18px;bottom:18px;z-index:99;max-width:340px;padding:10px 14px;background:#1b1b19;color:#f2d21b;border:1px solid #f2d21b;font:13px ui-monospace,monospace;opacity:0;transition:opacity .3s;pointer-events:none}" +
    ".egt.on{opacity:1}.egf{position:fixed;inset:0;z-index:98;background:#fff;opacity:.9;pointer-events:none;transition:opacity .5s}" +
    ".egs{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}";
  document.head.appendChild(st);
  function toast(t, ms) {
    var d = document.createElement("div"); d.className = "egt"; d.textContent = t; document.body.appendChild(d);
    requestAnimationFrame(function () { d.classList.add("on"); });
    setTimeout(function () { d.classList.remove("on"); setTimeout(function () { d.remove(); }, 400); }, ms || 3000);
  }
  function geiger(sec) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var end = ac.currentTime + sec;
      (function pop() {
        if (ac.currentTime > end) return;
        var n = ac.createBuffer(1, 220, ac.sampleRate), d = n.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 24);
        var s = ac.createBufferSource(), g = ac.createGain(); g.gain.value = .25;
        s.buffer = n; s.connect(g); g.connect(ac.destination); s.start();
        setTimeout(pop, 20 + Math.random() * 160);
      })();
    } catch (e) {}
  }
  function stamp() {
    var n = new Date(), p = function (x) { return ("0" + x).slice(-2); };
    return n.getFullYear() + p(n.getMonth() + 1) + p(n.getDate()) + "-" + p(n.getHours()) + p(n.getMinutes());
  }
  function mode(cls, ms) {
    document.documentElement.classList.add(cls);
    setTimeout(function () { document.documentElement.classList.remove(cls); }, ms);
  }
  var words = {
    scram: function () {
      var f = document.createElement("div"); f.className = "egf"; document.body.appendChild(f);
      requestAnimationFrame(function () { f.style.opacity = 0; }); setTimeout(function () { f.remove(); }, 700);
      toast("frame " + stamp() + "-page taken");
    },
    hazmat: function () { mode("haz", 6000); toast("sandbox: read-only, no network", 6000); },
    geiger: function () { geiger(6); toast("ok ok ok warn ok ok", 6000); },
    doas: function () { toast("doas: not permitted"); },
    rod: function () { toast("rod: nothing to remove"); },
    silo: function () { toast("silo: container created"); },
    blastdoor: function () { toast("blastdoor: port 31337 denied"); }
  };
  addEventListener("keydown", function (e) {
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    ki = e.keyCode === K[ki] ? ki + 1 : (e.keyCode === K[0] ? 1 : 0);
    if (ki === K.length) {
      ki = 0; mode("rad", 12000); geiger(12); toast("radiation level: elevated", 5000);
    }
    if (e.key && e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-12);
      for (var w in words) if (buf.slice(-w.length) === w) { buf = ""; words[w](); break; }
    }
  });
  document.addEventListener("click", function (e) {
    var s = e.target.closest && e.target.closest(".sbhead svg, header svg");
    if (s) {
      s.classList.add("egs"); s.style.transform = "rotate(" + (720 * (++clicks)) + "deg)";
    }
    if (e.target.closest && e.target.closest("footer p:first-child")) {
      clearTimeout(ct); ct = setTimeout(function () { n = 0; }, 900);
      if (++n >= 5) { n = 0; document.querySelectorAll("svg:not(.tosbar svg)").forEach(function (v) { v.classList.add("egs"); v.style.transform = "rotate(1440deg)"; }); toast("all frames flashed"); }
    }
  });
  var n = 0;
  // dose meter
  var ft = document.querySelector("footer .in");
  if (ft) {
    var m = document.createElement("a"), lv = .11;
    m.href = "#"; m.style.cssText = "font:12px ui-monospace,monospace;color:inherit;opacity:.7;text-decoration:none";
    m.title = "Background level"; ft.appendChild(m);
    setInterval(function () {
      lv = Math.max(.05, Math.min(.4, lv + (Math.random() - .5) * .03 + (.11 - lv) * .1));
      m.textContent = (Math.random() < .03 ? lv + 1.7 : lv).toFixed(2) + " \u00b5Sv/h";
    }, 1100);
    m.onclick = function (e) { e.preventDefault(); geiger(5); };
  }
  // tab title
  var T = document.title;
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? "Reactor unattended" : T;
  });
  // meltdown
  var lc = 0;
  document.addEventListener("click", function (e) {
    if (!(e.target.closest && e.target.closest(".sbhead svg, header svg"))) return;
    if (++lc < 10) return;
    lc = 0; mode("rad", 4000); geiger(4); toast("criticality reached");
    document.body.animate([{ transform: "translate(0,0)" }, { transform: "translate(-6px,3px)" }, { transform: "translate(5px,-4px)" }, { transform: "translate(0,0)" }], { duration: 120, iterations: 30 });
  });
  try { console.log("%c UraniumOS ", "background:#f2d21b;color:#1b1b19;font:bold 16px monospace", "\ntry: scram, hazmat, geiger, silo, blastdoor, rod"); } catch (e) {}
})();
