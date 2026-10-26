#!/usr/bin/env python3
"""
Simple local development HTTP server for Pranesh's World Runner game.
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching-free local dev
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run():
    port = PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"\n🎮 Pranesh's World Runner server is live!")
                print(f"👉 Open in your browser: http://localhost:{port}")
                print(f"👉 Direct URL: http://127.0.0.1:{port}\n")
                print("Press Ctrl+C to stop the server.\n")
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                port += 1
            else:
                raise e

if __name__ == '__main__':
    run()
