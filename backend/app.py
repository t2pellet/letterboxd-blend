from __future__ import annotations
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*", )