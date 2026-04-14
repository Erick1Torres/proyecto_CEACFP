# Suricata — IDS/IPS (Snort es alternativa equivalente en el enunciato)

## Por qué Suricata en este proyecto

- Encaja con el enunciato (**Snort o Suricata**).
- En **pfSense** existe paquete oficial **Suricata**; es una vía única para unificar firewall + IDS/IPS en el mismo laboratorio.

## Instalación en pfSense (recomendada para el TFG)

1. **System → Package Manager → Available Packages** → instalar **suricata**.
2. **Services → Suricata** → añadir instancia en la interfaz elegida (típicamente **WAN** para ver intentos desde la “Internet” simulada).
3. **Descarga de reglas:** configura **ET Open** (u otras permitidas por la práctica) y actualiza cuando el entorno tenga salida a Internet.
4. **Modo:**
   - **IDS:** alertas sin cortar tráfico (más seguro para no romper el lab al principio).
   - **IPS (inline):** puede bloquear; documenta riesgo y pruebas.

## Archivo de referencia en este repo

- [`referencia-snort-suricata-enunciato.md`](referencia-snort-suricata-enunciato.md): equivalencias Snort/Suricata y qué evidenciar (alertas, firmas).

## Pruebas que suelen generar alertas (solo en tu red aislada)

Desde una VM **atacante** hacia la IP **WAN** del pfSense:

```bash
nmap -sS -p 1-1024 <IP_WAN_PFSENSE>
```

Revisa en la interfaz de Suricata las **alertas** (firma, clasificación, IPs).

## Relación con el visor web del proyecto

Las alertas reales viven en **pfSense/Suricata**. El panel web del repo **simula** la capa IDS/IPS por tipo de ataque cuando registras un evento. Para la memoria: **captura de Suricata** + **registro en el panel** con el mismo contexto (tipo, IP, nota).
