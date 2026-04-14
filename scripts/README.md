# Scripts — web local y demostración automática

## Requisito

- **Python 3** (stdlib únicamente: `http.server`, `webbrowser`).

## Servir el proyecto (manual)

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Abre en el navegador: `http://127.0.0.1:8080/index.html`

Importante: usa **siempre el mismo host** (`127.0.0.1` o `localhost`, pero no mezcles) para que `localStorage` sea el mismo origen.

## Demostración automática (registros vía `log-attack.html`)

Registra tres ataques de ejemplo y abre el panel:

```bash
python3 scripts/run_lab_web_demo.py demo
```

Solo servidor HTTP (sin abrir el navegador):

```bash
python3 scripts/run_lab_web_demo.py serve
```

Puerto distinto:

```bash
python3 scripts/run_lab_web_demo.py demo --port 9090
```

## Nota sobre macOS

El script abre varias pestañas; puede que el navegador pida permiso o que debas traer la pestaña de `index.html` al frente manualmente.
