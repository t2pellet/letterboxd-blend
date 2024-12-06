from flask import Blueprint, jsonify
from letterboxdpy import user, movie
import re

users = Blueprint('user', __name__)

@users.route('/<name>/exists')
def get_exists(name):
    try:
        user.User(name)
        return jsonify({'exists': True})
    except Exception:
        return jsonify({'exists': False})


@users.route("/<name>/avatar")
def get_profile(name):
    user_instance = user.User(name)
    return user_instance.avatar


@users.route("/<name>/watchlist")
def get_watchlist(name):
    user_instance = user.User(name)
    watchlist = user.user_watchlist(user_instance)
    return watchlist

@users.route("/<name>/watched")
def get_rated(name):
    user_instance = user.User(name)
    rated = user.user_films(user_instance)
    return rated


@users.route("/<name>/followers")
def get_followers(name):
    user_instance = user.User(name)
    followers = user.user_followers(user_instance)
    return followers


@users.route("/<name>/following")
def get_following(name):
    user_instance = user.User(name)
    following = user.user_following(user_instance)
    return following
