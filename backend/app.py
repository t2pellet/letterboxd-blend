from __future__ import annotations
from flask import Flask
from flask_cors import CORS
from users import users
from posters import posters
from waitress import serve
import os


app = Flask(__name__)
if os.environ.get('NODE_ENV') != 'production':
    CORS(app)

app.register_blueprint(users, url_prefix='/api/users')
app.register_blueprint(posters, url_prefix='/api/posters')

if __name__ == '__main__':
    serve(app, listen='*:8080')
