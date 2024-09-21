import random
import string

from app import sio
from flask import Blueprint, Response, request, jsonify
from flask_socketio import join_room, leave_room, send, emit

session = Blueprint('session', __name__)
rooms = {}


class Room:
    def __init__(self, code, owner):
        self.code = code
        self.owner = owner
        self.state = 'wait'  # wait / swipe / match
        self.users = [owner]
        self.ratings = {}
        self.match = None


def gen_code():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(5))


@session.post('/')
def create_session():
    room = gen_code()
    user = request.json['user']
    rooms[room] = Room(room, user)
    return Response(room)


@session.get('/<room>')
def get_session(room):
    if room not in rooms:
        return jsonify({})
    room = rooms[room]
    return jsonify({'users': room.users, 'owner': room.owner, 'state': room.state, 'match': room.match})

@sio.on('join')
def join_session(data):
    user = data['user']
    room = data['room']
    if len(room) and len(user) and room in rooms:
        join_room(room)
        if user not in rooms[room].users:
            rooms[room].users.append(user)
            emit('joined', user, to=room)


@sio.on('leave')
def leave_session(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    if room in room[rooms] and user in rooms[room].users:
        rooms[room].users.remove(user)
    emit('left', user, to=room)


@sio.on('start')
def start_session(room):
    if room in rooms:
        rooms[room].state = 'swipe'
    emit('started', to=room)


@sio.on('rate')
def rate_movie(data):
    room = data['room']
    user = data['user']
    movie = data['slug']
    accept = data['like']
    if room in rooms and user in rooms[room].users:
        if user not in rooms[room].ratings:
            rooms[room].ratings[user] = {}
        rooms[room].ratings[user][movie] = accept
        for user in rooms[room].users:
            if user in rooms[room].ratings:
                if movie not in rooms[room].ratings[user] or not rooms[room].ratings[user][movie]:
                    return
            else:
                return
        rooms[room].state = 'match'
        rooms[room].match = movie
        emit('matched', movie, to=room)