# pfSense — firewall perimetral con reglas personalizadas

## Objetivo del bloque (enunciato)

Desplegar un **firewall perimetral** con **reglas personalizadas** documentadas (no solo valores por defecto), coherente con una red corporativa de **laboratorio**.

## Requisitos mínimos (VM)

- **2 vNIC:** WAN (entrada “externa” simulada) y LAN (red interna de prueba).
- **RAM:** 1 GB suele bastar para pruebas; 2 GB más cómodo.
- **ISO:** descarga amd64 desde [pfSense download](https://www.pfsense.org/download/).

## Flujo de instalación (resumen)

1. Crear VM con las dos interfaces; arrancar desde ISO e instalar.
2. Asignar **WAN** y **LAN** en la consola si el asistente lo pide.
3. Desde un navegador en la LAN, abrir la IP de gestión (por defecto suele ser `192.168.1.1`) y completar el asistente.
4. Activar **DHCP** en LAN para una VM “cliente” de prueba (opcional pero didáctico).

## Reglas personalizadas (qué documentar en la memoria)

Documenta **criterio**, **orden** y **efecto**:

- **Bloqueo explícito** de tráfico no necesario hacia la LAN (por puerto o por alias de IPs).
- Uso de **aliases** (listas de redes/puertos) con nombres claros.
- **Reglas anti-rastreo / anti-abuso** simples (p. ej. bloquear ICMP excesivo si lo justificas).
- **Registro (log)** activado en reglas clave para demostrar trazabilidad en **Status → System Logs → Firewall**.

> Las reglas reales dependen de tu topología; el archivo [`ejemplo-reglas-documentacion.txt`](ejemplo-reglas-documentacion.txt) es un **ejemplo comentado** para la memoria (no sustituye capturas de tu propia GUI).

## Prueba rápida

- Desde una VM en la **red atacante** (WAN o segmento externo simulado), genera tráfico que **deba bloquearse** según tu política.
- Verifica entradas en el **firewall log** que correspondan a la regla nombrada.

## Relación con el visor web del proyecto

Cuando documentes un bloqueo en pfSense, puedes **registrar** un evento equivalente en el panel (`log-attack.html` o formulario) con la misma IP origen y una nota tipo “bloqueo WAN verificado en log pfSense”.
