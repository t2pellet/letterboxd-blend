import os

from flask import Blueprint, Response
from dotenv import load_dotenv
from letterboxdpy.movie import Movie
import requests

load_dotenv()

posters = Blueprint('poster', __name__)
api_key = os.getenv('API_KEY')


@posters.route('/<slug>')
def get_poster(slug):
    movie = Movie(slug)
    res = requests.get(movie.poster)
    return Response(res.content, mimetype='image/jpeg')