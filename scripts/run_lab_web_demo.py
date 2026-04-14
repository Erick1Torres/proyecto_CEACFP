#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sirve el sitio estatico del proyecto y, opcionalmente, abre log-attack.html con
parametros para poblar localStorage (misma logica que attack-store.js).

Usa siempre el mismo host (127.0.0.1) para no mezclar origenes en el navegador.
"""

from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import sys
import threading
import time
import urllib.parse
import webbrowser

# Ataques de demostracion: (type, src, nota) — tipos validos en attack-store.js
DEMO_ATTACKS = [
    ("port_scan", "198.51.100.10", "demo_auto: escaneo"),
    ("brute_force_ssh", "203.0.113.5", "demo_auto: ssh"),
    ("sql_injection", "198.51.100.44", "demo_auto: sqli"),
]


def repo_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def create_server(port: int) -> socketserver.TCPServer:
    os.chdir(repo_root())
    handler = http.server.SimpleHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    return socketserver.TCPServer(("127.0.0.1", port), handler)


def start_server_background(httpd: socketserver.TCPServer) -> threading.Thread:
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return thread


def open_demo_urls(port: int, delay_sec: float) -> None:
    base = f"http://127.0.0.1:{port}"
    for attack_type, src, nota in DEMO_ATTACKS:
        q = urllib.parse.urlencode(
            {"type": attack_type, "src": src, "nota": nota},
            safe="",
        )
        url = f"{base}/log-attack.html?{q}"
        webbrowser.open(url)
        time.sleep(delay_sec)
    # Ultima apertura: panel principal (lista ya actualizada tras redirecciones)
    time.sleep(max(0.2, delay_sec))
    webbrowser.open(f"{base}/index.html")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Servidor HTTP local para proyecto_CEACFP (visor de ataques)."
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_serve = sub.add_parser("serve", help="Solo sirve archivos (sin abrir el navegador).")
    p_serve.add_argument("--port", type=int, default=8080)

    p_demo = sub.add_parser(
        "demo",
        help="Sirve y abre URLs de log-attack para registrar ataques de demostracion.",
    )
    p_demo.add_argument("--port", type=int, default=8080)
    p_demo.add_argument(
        "--delay",
        type=float,
        default=0.45,
        help="Segundos entre aperturas de pestañas (por defecto 0.45).",
    )

    args = parser.parse_args()

    if args.cmd == "serve":
        httpd = create_server(args.port)
        print(f"Sirviendo {repo_root()} en http://127.0.0.1:{args.port}/")
        print("Pulsa Ctrl+C para detener.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            httpd.shutdown()
        return 0

    if args.cmd == "demo":
        httpd = create_server(args.port)
        start_server_background(httpd)
        print(f"Sirviendo {repo_root()} en http://127.0.0.1:{args.port}/")
        print("Abriendo el navegador para registrar ataques de demostracion…")
        time.sleep(0.3)
        open_demo_urls(args.port, args.delay)
        print("Listo. Revisa index.html en la ultima pestaña; pulsa Ctrl+C para detener el servidor.")
        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            httpd.shutdown()
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
