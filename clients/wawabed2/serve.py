#!/usr/bin/env python3
"""WawaBed v2 — lokalny serwer podglądu. Uruchom: python serve.py"""
import http.server, socketserver, webbrowser
PORT = 8082
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"WawaBed v2 → http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}/01_STRONA_GLOWNA_PL.html")
    httpd.serve_forever()
