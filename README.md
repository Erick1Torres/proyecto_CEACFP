# Registro de ataques (laboratorio) — IDS/IPS · Firewall · Auditoria

Pagina web local que **registra ataques simulados o enviados por script** (por ejemplo tus propias pruebas automatizadas), muestra **cuantos ataques hubo** y asocia **cada evento a los tres pasos** del proyecto: deteccion IDS/IPS (Snort/Suricata), respuesta de **firewall perimetral** (pfSense u hardware) y **auditoria / mitigacion** (pentest y refuerzo).

Importante: esto es un **registro en el navegador** (`localStorage`), no sustituye a un IDS o firewall reales. Sirve como **demo academica** y panel de seguimiento.

## Laboratorio pfSense + Suricata + auditoria (memoria / TFG)

La **implementacion en red** (VMs, ISOs, paquetes) no puede empaquetarse dentro de los HTML; esta en el directorio **`lab/`**:

- [`lab/README.md`](lab/README.md) — indice
- [`lab/pfsense/`](lab/pfsense/README.md) — firewall perimetral y reglas documentadas
- [`lab/suricata/`](lab/suricata/README.md) — IDS/IPS con Suricata (Snort como alternativa en el enunciato)
- [`lab/auditoria/`](lab/auditoria/README.md) — pentest y mitigaciones
- [`lab/LIMITACIONES-Y-ALTERNATIVAS.md`](lab/LIMITACIONES-Y-ALTERNATIVAS.md) — que vive en Git y que no

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | Panel principal: contadores, registro manual, lista y tres capas por ataque |
| `attack-store.js` | Logica compartida: tipos de ataque, persistencia, conteos, respuesta simulada de las 3 capas |
| `app.js` | Interfaz (filtros, tema, exportacion) |
| `log-attack.html` | Pagina minima para **anadir un ataque por URL** y volver al panel (idonea para automatizacion) |
| `style.css` | Estilos complementarios |
| `scripts/run_lab_web_demo.py` | Servidor HTTP local + demo que abre `log-attack.html` con parametros (ver [`scripts/README.md`](scripts/README.md)) |

## Web automatizada (recomendado para Git / mismo origen HTTP)

Usa **Python 3** desde la raiz del repo:

```bash
python3 scripts/run_lab_web_demo.py demo
```

Eso levanta `http://127.0.0.1:8080/` y registra varios ataques de ejemplo mediante `log-attack.html` (misma logica que siempre). Detalle: [`scripts/README.md`](scripts/README.md).

## Uso rapido

1. Abre `index.html` en el navegador.
2. Elige tipo, opcionalmente IP de origen y nota; pulsa **Registrar ataque**, o **Simular ataque aleatorio**.
3. Revisa **Total ataques**, **ultimas 24 h** y severidades.
4. Cada fila muestra las **tres capas** (IDS/IPS, firewall, auditoria) con texto coherente con tu enunciado.

## Automatizar registros (tu codigo / script externo)

### Opcion A: `log-attack.html` (recomendada)

Abre (o haz que tu script abra) una URL con parametros:

```text
log-attack.html?type=port_scan&src=198.51.100.10&nota=prueba_lab
```

Parametros:

- `type` o `attack`: uno de los tipos definidos en `attack-store.js` (`port_scan`, `brute_force_ssh`, `sql_injection`, `ddos`, `malware_c2`, `phishing`, `lateral_movement`). Si no coincide, se guarda como `unknown`.
- `src` o `source`: IP u origen (opcional; si falta, se genera una IP aleatoria).
- `note` o `nota`: texto libre (opcional).

La pagina registra el ataque y **redirige** a `index.html`.

### Opcion B: parametros en `index.html`

Al cargar el panel con:

```text
index.html?type=brute_force_ssh&src=203.0.113.5
```

se registra **un** ataque y se limpia la barra de direcciones.

### Ejemplo PowerShell (Windows)

Ajusta la ruta a tu carpeta; en `file:///` las barras son `/`:

```powershell
$root = "C:/Users/sl555/Desktop/PROYECTO_ASIR"
1..3 | ForEach-Object {
  $u = "file:///$root/log-attack.html?type=port_scan&src=198.51.100.$_"
  Start-Process $u
  Start-Sleep -Milliseconds 400
}
```

(Tambien puedes servir la carpeta con un servidor HTTP local y usar `http://localhost:8080/log-attack.html?...` si prefieres evitar `file://`.)

## Exportar y borrar

- **Exportar JSON**: descarga el registro para entregarlo o analizarlo.
- **Vaciar registro**: borra el historial local.

## Objetivo final

Tener un **visor unificado** que cuente ataques registrados y muestre como cada uno se enmarca en **deteccion IDS/IPS**, **corte / politica en firewall perimetral** y **trazabilidad en auditoria y refuerzo** — alineado con los tres pasos del proyecto ASIR.
