import MovieDB from "node-themoviedb";
import env from "@/constants/env";

const TMDB = new MovieDB(env.MovieAPI);

export default TMDB;
