# Limitaciones (honestidad técnica) y alternativas

## Qué **no** puede vivir dentro de este repositorio Git

| Componente | Limitación | Por qué |
|------------|------------|---------|
| **pfSense** | Es un **sistema operativo/firewall** completo. No se “compila” dentro de una carpeta de proyecto web. | Se despliega como **VM** (VirtualBox, VMware, Proxmox) o **hardware**. |
| **Suricata** | Es un **servicio de sistema** que inspecciona tráfico de red (interfaces, PCAP, reglas). | Se instala en **pfSense** (paquete) o en **Linux**, no dentro del navegador. |
| **Tu panel web (`localStorage`)** | Solo ve lo que **registras** en el mismo origen (`http://127.0.0.1:puerto` o `file://`). | No recibe alertas reales de Suricata **sin** un backend o sin copiar datos manualmente. |

## Cómo seguir usando este repo para el TFG (sin romper la lógica actual)

1. **Laboratorio real:** sigue las guías en `lab/pfsense/` y `lab/suricata/` en una o dos VMs. Documenta con **capturas** y **exportaciones** de reglas/alertas.
2. **Panel web:** úsalo como **visor y bitácora** alineada con la tríada (IDS/IPS, firewall, auditoría). Los eventos los cargas **manualmente**, por **URL** (`log-attack.html`) o con el **script** `scripts/run_lab_web_demo.py` (automatización del registro en el navegador).
3. **Puente manual (opcional):** tras un pentest o una alerta real de Suricata, **registra** el mismo incidente en el panel (mismo tipo aproximado, IP origen, nota). Así el tribunal ve **coherencia** entre laboratorio y visor.
4. **Si en el futuro quieres integración real:** habría que añadir un **backend** (por ejemplo Python/Node) que lea logs JSON de Suricata y los exponga por API; eso **sí** sería código nuevo y un alcance distinto. Puedo ayudarte en ese paso cuando lo pidas.
