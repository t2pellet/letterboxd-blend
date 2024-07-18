from __future__ import annotations
from flask import Flask
from flask_cors import CORS
from users import users
from posters import posters

app = Flask(__name__)
CORS(app)


app.register_blueprint(users, url_prefix='/users')
app.register_blueprint(posters, url_prefix='/posters')


if __name__ == '__main__':
    app.run()
