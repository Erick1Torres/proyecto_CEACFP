# Snort vs Suricata (enunciato)

Ambos cumplen el requisito **“herramientas como Snort o Suricata”**.

| Aspecto | Snort | Suricata |
|--------|-------|----------|
| Rol | IDS/IPS clásico, muy citado en bibliografía | IDS/IPS multihilo, buen rendimiento |
| En pfSense | Paquete **Snort** disponible | Paquete **Suricata** disponible |
| Evidencia para memoria | Alertas, SID, reglas | Alertas, firma ET, clasificación |

**Recomendación en este repositorio:** desplegar **Suricata** en pfSense y citar en la memoria que **Snort** sería una alternativa válida bajo el mismo enunciato.

## Qué evidencia guardar (mínimo)

1. Pantalla o export de **lista de alertas** con timestamp.
2. Una alerta con **mensaje de firma** legible.
3. Indicación de **interfaz** donde escucha Suricata (WAN/LAN).
4. Si usas IPS: una captura o nota de **acción de bloqueo** coherente con la política.
