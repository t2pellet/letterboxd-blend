from flask_cors import CORS
from users import users
from posters import posters
from app import sio, app
import session
import os

if os.environ.get('NODE_ENV') != 'production':
    CORS(app)

app.register_blueprint(users, url_prefix='/api/users')
app.register_blueprint(posters, url_prefix='/api/posters')
app.register_blueprint(session.session, url_prefix='/api/session')

if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', port=8081, allow_unsafe_werkzeug=True)