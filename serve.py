import ssl
import os
import http.server

from pathlib import Path

REAL_PATH = Path(__file__).resolve().parents[1]
CERT_PATH = os.path.join(REAL_PATH, 'certs/host.cert')
KEY_PATH = os.path.join(REAL_PATH, 'certs/host.key')
print(KEY_PATH)

SERVER_ADDRESS = ('0.0.0.0', 4443)

Handler = http.server.SimpleHTTPRequestHandler

HTTPD = http.server.HTTPServer(SERVER_ADDRESS, Handler)
HTTPD.socket = ssl.wrap_socket(HTTPD.socket, server_side=True,
        certfile=CERT_PATH, keyfile=KEY_PATH, ssl_version=ssl.PROTOCOL_TLSv1)

print("serving at: ", SERVER_ADDRESS)
HTTPD.serve_forever()
