# Auditoría y refuerzo — pentest y mitigación (red corporativa de laboratorio)

## Alcance (define esto por escrito antes de probar)

- **Activos:** VMs, IPs, servicios (p. ej. SSH, HTTP de prueba).
- **Red:** solo el laboratorio aislado; **no** sistemas ajenos ni producción.
- **Herramientas:** documenta versiones (p. ej. `nmap`, escáner de vulnerabilidades permitido por tu centro).

## Metodología sugerida (orden)

1. **Inventario:** hosts vivos, puertos, servicios.
2. **Análisis de configuración:** firewall (pfSense), reglas Suricata, hardening de SO.
3. **Pruebas controladas:** solo lo acordado con el tutor / reglamento.
4. **Informe de hallazgos:** severidad, evidencia, **recomendación de mitigación**.

## Plantilla de tabla (para la memoria)

| ID | Hallazgo | Riesgo | Mitigación | Verificación |
|----|----------|--------|------------|--------------|
| H1 | … | Alto/Medio/Bajo | Regla WAN / parche / deshabilitar servicio | Re-escaneo / log limpio |

## Vínculo con el visor web del proyecto

Tras cada hallazgo relevante, puedes **registrar** en el panel un evento con `type` acorde (`port_scan`, `brute_force_ssh`, etc.), IP de origen simulada o real del lab, y nota **“mitigación: …”**. Así la **tríada** (IDS/IPS, firewall, auditoría) queda visible en la misma interfaz que ya implementaste.
