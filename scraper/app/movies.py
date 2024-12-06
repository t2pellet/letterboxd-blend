from flask import Blueprint, request
from letterboxdpy import movie
import re

movies = Blueprint('movies', __name__)

@movies.route('/<slug>/id')
def get_id(slug):
    film = movie.Movie(slug)
    match = re.search(r'movie/(\d+)', film.tmdb_link)
    return match.group(1)

@movies.route('/id')
def get_ids():
    slugs = request.args.get('slugs').split(',')
    result = []
    for slug in slugs:
        film = movie.Movie(slug)
        tmdb_id = re.search(r'movie/(\d+)', film.tmdb_link).group(1)
        result.append({ "slug": slug, "id": tmdb_id })
    return result