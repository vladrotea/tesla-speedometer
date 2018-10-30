import ssl
import os
import http.server

REAL_PATH, _ = os.path.split(os.path.realpath(__file__))
CERT_PATH = os.path.join(REAL_PATH, 'host.cert')
KEY_PATH = os.path.join(REAL_PATH, 'host.key')

SERVER_ADDRESS = ('127.0.0.1', 4443)

Handler = http.server.SimpleHTTPRequestHandler

HTTPD = http.server.HTTPServer(SERVER_ADDRESS, Handler)
HTTPD.socket = ssl.wrap_socket(HTTPD.socket, server_side=True,
        certfile=CERT_PATH, keyfile=KEY_PATH, ssl_version=ssl.PROTOCOL_TLSv1)

print("serving at: ", SERVER_ADDRESS)
HTTPD.serve_forever()
