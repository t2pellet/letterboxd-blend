import random
import string
from json import loads

from app import sio
from flask import Blueprint, Response, request, jsonify
from flask_socketio import join_room, leave_room, send, emit

session = Blueprint('session', __name__)
rooms = {}


class Room:
    def __init__(self, code, owner):
        self.code = code
        self.owner = owner
        self.started = False
        self.users = [owner]
        self.ratings = {}


def gen_code():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(5))


@session.post('/')
def create_session():
    room = gen_code()
    user = request.json['user']
    rooms[room] = Room(room, user)
    return Response(room)


@session.get('/<room>')
def get_users(room):
    if room not in rooms:
        return jsonify({})
    users = rooms[room].users
    owner = rooms[room].owner
    return jsonify({'users': users, 'owner': owner})


@sio.on('join')
def join_session(data):
    user = data['user']
    room = data['room']
    if len(room) and len(user) and room in rooms:
        join_room(room)
        if user not in rooms[room].users:
            rooms[room].users.append(user)
            emit('joined', user, to=room, include_self=True)


@sio.on('leave')
def leave_session(data):
    json = loads(data)
    user = json['user']
    room = json['room']
    leave_room(room)
    emit('left', user, to=room, include_self=True)


@sio.on('start')
def start_session(room):
    emit('started', to=room, include_self=True)


@sio.on('rate')
def rate_movie(data):
    json = loads(data)
    room = json['room']
    user = json['user']
    movie = json['slug']
    accept = json['like']
    if room in rooms:
        if user not in rooms[room]['ratings']:
            rooms[room]['ratings'][user] = {}
        rooms[room]['ratings'][user][movie] = accept
        for user in rooms[room]['users']:
            if user in rooms[room]['ratings']:
                if movie not in rooms[room]['ratings'][user] or not rooms[room]['ratings'][user][movie]:
                    return
        emit('match', movie, to=room, include_self=True)
        del rooms[room]
