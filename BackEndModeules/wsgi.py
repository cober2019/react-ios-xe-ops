from api_routes import app
import os
import ssl

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(f'{os.getcwd()}/domainame.crt', f'{os.getcwd()}/domainame.key')

if __name__ == "__main__":
    app.run(ssl_context=ctx)
