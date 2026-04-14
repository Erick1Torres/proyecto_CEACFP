/**
 * Registro central de ataques (misma clave en index y log-attack).
 * Cada entrada pasa por las 3 capas: IDS/IPS, firewall perimetral, auditoria.
 */
(function (global) {
  var STORAGE_KEY = "corpAttackLog_v1";

  var TYPE_META = {
    port_scan: { label: "Escaneo de puertos", severity: "medium" },
    brute_force_ssh: { label: "Fuerza bruta SSH", severity: "high" },
    sql_injection: { label: "SQL injection", severity: "high" },
    ddos: { label: "Intento de DoS / saturacion", severity: "high" },
    malware_c2: { label: "Beacon / C2 (callback)", severity: "high" },
    phishing: { label: "Phishing / credenciales", severity: "medium" },
    lateral_movement: { label: "Movimiento lateral", severity: "high" },
    unknown: { label: "Tipo no clasificado", severity: "low" },
  };

  function randomOctet() {
    return Math.floor(Math.random() * 223) + 1;
  }

  function randomExternalIp() {
    return (
      randomOctet() + "." + randomOctet() + "." + randomOctet() + "." + randomOctet()
    );
  }

  /**
   * Respuesta simulada de las tres capas segun el proyecto (Snort/Suricata, pfSense, auditoria).
   */
  function buildLayers(typeKey, meta) {
    var sev = meta.severity;
    var idsTool = sev === "high" ? "Suricata (IPS inline)" : "Snort / Suricata (IDS)";
    var fwTool = "pfSense / firewall perimetral";

    return {
      ids_ips: {
        tool: idsTool,
        action: "Detectado",
        detail:
          typeKey === "port_scan"
            ? "Firma ET SCAN: barrido TCP/UDP en segmento expuesto."
            : typeKey === "brute_force_ssh"
              ? "Multi-evento SSH desde origen unico: correlacion IDS."
              : "Alarma IDS: patron anomalo asociado al tipo de ataque.",
      },
      firewall: {
        tool: fwTool,
        action: sev === "high" ? "Bloqueado (DROP)" : "Limitado / bloqueo temporal",
        detail:
          sev === "high"
            ? "Regla WAN: deny origen + rate-limit; sesion no establecida."
            : "Politica de minimo privilegio: puertos no admitidos descartados.",
      },
      audit: {
        tool: "Pentest / inventario / hardening",
        action: "Registrado",
        detail:
          "Evento anotado para trazabilidad; recomendacion de mitigacion y re-test documentado.",
      },
    };
  }

  function normalizeType(typeKey) {
    return TYPE_META[typeKey] ? typeKey : "unknown";
  }

  function readAll() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveAll(list) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /**
   * @param {{ type?: string, source?: string, note?: string }} opts
   */
  function addAttack(opts) {
    var typeKey = normalizeType((opts && opts.type) || "unknown");
    var meta = TYPE_META[typeKey] || TYPE_META.unknown;
    var source = (opts && opts.source && String(opts.source).trim()) || randomExternalIp();
    var note = (opts && opts.note && String(opts.note).trim()) || "";

    var entry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      at: new Date().toISOString(),
      type: typeKey,
      typeLabel: meta.label,
      severity: meta.severity,
      source: source,
      note: note,
      layers: buildLayers(typeKey, meta),
    };

    var list = readAll();
    list.unshift(entry);
    saveAll(list);

    try {
      global.dispatchEvent(
        new CustomEvent("corp-attack-logged", { detail: { count: list.length } })
      );
    } catch {
      /* no CustomEvent in very old browsers */
    }

    return entry;
  }

  /** Procesa ?type=...&src=...&note=... al cargar index.html */
  function consumeQueryOnIndex() {
    var params = new URLSearchParams(global.location.search);
    if (!params.get("type") && !params.get("attack")) return false;

    addAttack({
      type: params.get("type") || params.get("attack"),
      source: params.get("src") || params.get("source") || "",
      note: params.get("note") || "",
    });

    global.history.replaceState({}, "", global.location.pathname);
    return true;
  }

  /** Parametros en log-attack.html (mismos nombres) */
  function addFromCurrentQuery() {
    var params = new URLSearchParams(global.location.search);
    if (!params.get("type") && !params.get("attack")) return false;
    addAttack({
      type: params.get("type") || params.get("attack"),
      source: params.get("src") || params.get("source") || "",
      note: params.get("note") || "",
    });
    return true;
  }

  function clearAll() {
    saveAll([]);
  }

  function counts() {
    var all = readAll();
    var now = Date.now();
    var dayMs = 24 * 60 * 60 * 1000;
    var today = 0;
    var bySev = { high: 0, medium: 0, low: 0 };

    for (var i = 0; i < all.length; i++) {
      var t = new Date(all[i].at).getTime();
      if (now - t < dayMs) today++;
      var s = all[i].severity;
      if (bySev[s] !== undefined) bySev[s]++;
    }

    return {
      total: all.length,
      last24h: today,
      bySeverity: bySev,
    };
  }

  global.AttackStore = {
    STORAGE_KEY: STORAGE_KEY,
    TYPE_META: TYPE_META,
    readAll: readAll,
    addAttack: addAttack,
    consumeQueryOnIndex: consumeQueryOnIndex,
    addFromCurrentQuery: addFromCurrentQuery,
    clearAll: clearAll,
    counts: counts,
    randomExternalIp: randomExternalIp,
  };
})(typeof window !== "undefined" ? window : globalThis);
