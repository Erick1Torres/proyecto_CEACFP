(function () {
  var THEME_KEY = "corpAttackTheme";

  var form = document.getElementById("attack-form");
  var typeSelect = document.getElementById("attack-type");
  var sourceInput = document.getElementById("attack-source");
  var noteInput = document.getElementById("attack-note");
  var btnRandom = document.getElementById("btn-random");
  var btnClear = document.getElementById("btn-clear");
  var btnExport = document.getElementById("btn-export");
  var filterType = document.getElementById("filter-type");
  var filterSev = document.getElementById("filter-sev");
  var list = document.getElementById("attack-list");
  var template = document.getElementById("attack-template").content;
  var emptyState = document.getElementById("empty-state");
  var emptyTitle = document.getElementById("empty-title");
  var emptySub = document.getElementById("empty-sub");

  var statTotal = document.getElementById("stat-total");
  var stat24 = document.getElementById("stat-24h");
  var statHigh = document.getElementById("stat-high");
  var statRest = document.getElementById("stat-rest");
  var pillarIds = document.getElementById("pillar-ids-count");
  var pillarFw = document.getElementById("pillar-fw-count");
  var pillarAudit = document.getElementById("pillar-audit-count");
  var listCount = document.getElementById("list-count");

  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon = document.getElementById("theme-icon");
  var toastContainer = document.getElementById("toast-container");

  var TYPE_META = AttackStore.TYPE_META;
  var typeKeys = Object.keys(TYPE_META).filter(function (k) {
    return k !== "unknown";
  });

  function fillTypeSelects() {
    typeSelect.innerHTML = "";
    filterType.innerHTML = "";
    var allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "Todos los tipos";
    filterType.appendChild(allOpt);

    typeKeys.forEach(function (key) {
      var o = document.createElement("option");
      o.value = key;
      o.textContent = TYPE_META[key].label;
      typeSelect.appendChild(o);

      var f = document.createElement("option");
      f.value = key;
      f.textContent = TYPE_META[key].label;
      filterType.appendChild(f);
    });
  }

  function applyTheme(name) {
    var dark = name === "dark";
    document.documentElement.classList.toggle("dark", dark);
    themeIcon.textContent = dark ? "☀️" : "🌙";
  }

  function showToast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    toastContainer.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 2400);
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleString("es-ES");
    } catch {
      return iso;
    }
  }

  function updateStats() {
    var c = AttackStore.counts();
    statTotal.textContent = String(c.total);
    stat24.textContent = String(c.last24h);
    statHigh.textContent = String(c.bySeverity.high);
    statRest.textContent = String(c.bySeverity.medium + c.bySeverity.low);

    var n = c.total;
    pillarIds.textContent = String(n);
    pillarFw.textContent = String(n);
    pillarAudit.textContent = String(n);
  }

  function matchesFilter(entry) {
    var t = filterType.value;
    var s = filterSev.value;
    if (t !== "all" && entry.type !== t) return false;
    if (s !== "all" && entry.severity !== s) return false;
    return true;
  }

  function renderList() {
    var all = AttackStore.readAll();
    var filtered = all.filter(matchesFilter);

    listCount.textContent = String(filtered.length);

    list.innerHTML = "";
    if (!filtered.length) {
      emptyState.classList.remove("hidden");
      if (all.length && !filtered.length) {
        emptyTitle.textContent = "Ningun resultado con este filtro";
        emptySub.textContent = "Cambia tipo o severidad, o restablece filtros.";
      } else {
        emptyTitle.textContent = "No hay ataques en el registro";
        emptySub.textContent =
          "Registra uno manualmente, simula uno o envia uno por URL o log-attack.html";
      }
      updateStats();
      return;
    }
    emptyState.classList.add("hidden");

    filtered.forEach(function (a) {
      var clone = template.cloneNode(true);
      var row = clone.querySelector(".attack-row");
      var title = row.querySelector(".attack-title");
      var meta = row.querySelector(".attack-meta");
      var sev = row.querySelector(".sev-badge");

      title.textContent = a.typeLabel || a.type;
      meta.textContent =
        formatDate(a.at) +
        " · Origen " +
        a.source +
        (a.note ? " · " + a.note : "");

      sev.textContent =
        a.severity === "high"
          ? "Severidad alta"
          : a.severity === "medium"
            ? "Severidad media"
            : "Severidad baja";
      sev.className =
        "sev-badge text-xs font-bold px-3 py-1 rounded-full h-fit sev-" + a.severity;

      var L = a.layers;
      var ids = row.querySelector(".layer-ids");
      var fw = row.querySelector(".layer-fw");
      var aud = row.querySelector(".layer-audit");

      ids.querySelector(".layer-tool").textContent = L.ids_ips.tool;
      ids.querySelector(".layer-action").textContent = L.ids_ips.action;
      ids.querySelector(".layer-detail").textContent = L.ids_ips.detail;

      fw.querySelector(".layer-tool").textContent = L.firewall.tool;
      fw.querySelector(".layer-action").textContent = L.firewall.action;
      fw.querySelector(".layer-detail").textContent = L.firewall.detail;

      aud.querySelector(".layer-tool").textContent = L.audit.tool;
      aud.querySelector(".layer-action").textContent = L.audit.action;
      aud.querySelector(".layer-detail").textContent = L.audit.detail;

      list.appendChild(clone);
    });

    updateStats();
  }

  function onSubmit(e) {
    e.preventDefault();
    AttackStore.addAttack({
      type: typeSelect.value,
      source: sourceInput.value.trim(),
      note: noteInput.value.trim(),
    });
    sourceInput.value = "";
    noteInput.value = "";
    showToast("Ataque registrado.");
    renderList();
  }

  function onRandom() {
    var k = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    AttackStore.addAttack({
      type: k,
      source: "",
      note: "Simulacion automatica",
    });
    showToast("Ataque aleatorio registrado.");
    renderList();
  }

  function onClear() {
    if (!AttackStore.readAll().length) return;
    if (!confirm("Borrar todo el registro de ataques?")) return;
    AttackStore.clearAll();
    showToast("Registro vaciado.");
    renderList();
  }

  function onExport() {
    var blob = new Blob([JSON.stringify(AttackStore.readAll(), null, 2)], {
      type: "application/json",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "registro-ataques-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("JSON exportado.");
  }

  function init() {
    fillTypeSelects();

    var theme =
      localStorage.getItem(THEME_KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(theme);

    var qs = new URLSearchParams(window.location.search);
    if (qs.get("logError")) {
      showToast('En log-attack.html debes usar type o attack en la URL.');
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (AttackStore.consumeQueryOnIndex()) {
      showToast("Ataque registrado desde URL.");
    }

    themeToggle.addEventListener("click", function () {
      var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });

    form.addEventListener("submit", onSubmit);
    btnRandom.addEventListener("click", onRandom);
    btnClear.addEventListener("click", onClear);
    btnExport.addEventListener("click", onExport);
    filterType.addEventListener("change", renderList);
    filterSev.addEventListener("change", renderList);

    window.addEventListener("storage", function (ev) {
      if (ev.key === AttackStore.STORAGE_KEY) renderList();
    });

    window.addEventListener("corp-attack-logged", function () {
      renderList();
    });

    renderList();
  }

  init();
})();
