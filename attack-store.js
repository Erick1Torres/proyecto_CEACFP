const AttackStore = {
    STORAGE_KEY: "asir_security_logs",

    // Tipos de ataque reales para un proyecto ASIR
    types: {
        port_scan: { label: "Escaneo de Puertos (Nmap)", severity: "medium", ids: "Detección de SYN Scan", fw: "Bloqueo de IP (60 min)", audit: "Cerrar puertos no críticos" },
        sql_injection: { label: "SQL Injection detectada", severity: "high", ids: "Firma de ataque Web detectada", fw: "Drop de paquete HTTP", audit: "Sanitizar DB y Backend" },
        brute_force: { label: "Fuerza Bruta SSH", severity: "high", ids: "Múltiples reintentos de login", fw: "IP Baneada en pfSense", audit: "Usar llaves RSA, no password" },
        ddos: { label: "Ataque DoS (Saturación)", severity: "high", ids: "Anomalía de tráfico entrante", fw: "Rate Limiting activado", audit: "Implementar balanceador" }
    },

    readAll() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    },

    addAttack(typeKey) {
        const all = this.readAll();
        const meta = this.types[typeKey] || this.types.port_scan;
        const newEntry = {
            id: Date.now(),
            at: new Date().toLocaleString(),
            type: meta.label,
            severity: meta.severity,
            source: `192.168.100.${Math.floor(Math.random() * 254)}`,
            ids: meta.ids,
            fw: meta.fw,
            audit: meta.audit
        };
        all.unshift(newEntry);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        return newEntry;
    },

    clear() {
        localStorage.setItem(this.STORAGE_KEY, "[]");
    }
};