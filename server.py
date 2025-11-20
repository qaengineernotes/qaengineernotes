import http.server
import socketserver
import os
import socketserver

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Check if the path has an extension
        if '.' not in self.path:
            # Try to find a corresponding .html file
            html_path = self.path.rstrip('/') + '.html'
            if os.path.exists(os.path.join(os.getcwd(), html_path.lstrip('/'))):
                self.path = html_path
        
        super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever() 

