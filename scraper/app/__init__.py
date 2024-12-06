import os

from flask import Flask
from flask_cors import CORS
from users import users
from movies import movies

app = Flask(__name__)
if os.environ.get('NODE_ENV') == 'production':
    CORS(app)

app.register_blueprint(users, url_prefix='/users')
app.register_blueprint(movies, url_prefix='/movies')

if __name__ == "__main__":
    app.run(
        host="0.0.0.0", port=8000
    )