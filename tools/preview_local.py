#!/usr/bin/env python3
from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import sys
import threading
import webbrowser
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the KV Cache Teaching Kit locally.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind to.")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to.")
    parser.add_argument("--no-open", action="store_true", help="Do not open a browser automatically.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(__file__).resolve().parent.parent
    os.chdir(repo_root)

    handler = http.server.SimpleHTTPRequestHandler

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer((args.host, args.port), handler) as httpd:
        url = f"http://{args.host}:{args.port}/docs/index.html"
        print(f"Serving {repo_root} at {url}")

        if not args.no_open:
          threading.Timer(0.4, lambda: webbrowser.open(url)).start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped local preview server.")
            return 0


if __name__ == "__main__":
    sys.exit(main())
