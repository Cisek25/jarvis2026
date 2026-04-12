#!/usr/bin/env python3
"""Simple CORS HTTP server for pushing files to CMS via browser fetch()"""
import http.server
import socketserver

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

PORT = 8787
with socketserver.TCPServer(("", PORT), CORSHandler) as httpd:
    print(f"CORS server on http://localhost:{PORT}")
    httpd.serve_forever()
