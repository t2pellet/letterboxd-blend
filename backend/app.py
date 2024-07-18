from __future__ import annotations
from flask import Flask
from flask_cors import CORS
from users import users
from posters import posters
from waitress import serve


app = Flask(__name__)


app.register_blueprint(users, url_prefix='/api/users')
app.register_blueprint(posters, url_prefix='/api/posters')

@app.get("/api")
def get_test():
    return 'hi'

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)
