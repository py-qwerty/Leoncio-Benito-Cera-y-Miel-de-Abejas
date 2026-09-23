"""Serve the static site locally with automatic browser reloads."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PORT = 8765
RELOAD_SCRIPT = b"""
<script>
  (() => {
    let version;
    setInterval(async () => {
      try {
        const response = await fetch('/_dev/version', { cache: 'no-store' });
        const current = await response.text();
        if (version !== undefined && current !== version) location.reload();
        version = current;
      } catch (_) {}
    }, 1000);
  })();
</script>
"""


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/_dev/version":
            files = (path for path in ROOT.rglob("*") if path.suffix.lower() in {".html", ".css", ".jpg", ".jpeg", ".png", ".svg"})
            version = str(max((path.stat().st_mtime_ns for path in files), default=0)).encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(version)))
            self.end_headers()
            self.wfile.write(version)
            return

        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path /= "index.html"
        if path.is_file() and path.suffix.lower() == ".html":
            page = path.read_bytes().replace(b"</body>", RELOAD_SCRIPT + b"</body>")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(page)))
            self.end_headers()
            self.wfile.write(page)
            return
        super().do_GET()


if __name__ == "__main__":
    print(f"Vista previa: http://localhost:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
