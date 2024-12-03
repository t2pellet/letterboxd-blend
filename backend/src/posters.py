import os

from flask import Blueprint, Response
from dotenv import load_dotenv
from letterboxdpy.movie import Movie
import requests
import re

load_dotenv()

posters = Blueprint('poster', __name__)
api_key = os.environ['RPDB_API_KEY']

@posters.route('/<slug>')
def get_poster(slug):
    movie = Movie(slug)
    tmdb_id = re.search('imdb.com/title/(.*)/', movie.tmdb_link)
    res = requests.get('https://api.ratingposterdb.com/{api_key}/imdb/poster-default/{tmdb_id}.jpg')
    return Response(res.content, mimetype='image/jpeg')