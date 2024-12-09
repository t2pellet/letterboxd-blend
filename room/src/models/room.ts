export interface Movie {
  id: number;
  vote: boolean;
}

export interface User {
  name: string;
  vote: boolean;
}

export default class Room {
  private userMovies: Record<string, Movie[]> = {};
  private movieUsers: Record<number, User[]> = {};
  private users: Set<string> = new Set();
  private movies: Set<number> = new Set();
  private isStarted: boolean = false;
  constructor(
    public readonly id: string,
    public readonly owner: string,
  ) {}

  get match() {
    const result = Object.entries(this.movieUsers).find(([, users]) => {
      return users.every((u) => u.vote);
    });
    return result ? result[0] : null;
  }

  get started() {
    return this.isStarted;
  }

  get moviesSorted() {
    const movieValue = (movie: number) => {
      return this.movieUsers[movie]
        .map((u) => (u.vote ? 1 : -1))
        .reduce((res: number, x) => res + x, 0);
    };

    return Array.from(this.movies).sort((movie1, movie2) => {
      return movieValue(movie2) - movieValue(movie1);
    });
  }

  start() {
    this.isStarted = true;
  }

  addUser(user: string) {
    if (!this.users.has(user)) {
      this.users.add(user);
      this.userMovies[user] = [];
    }
  }

  setMovies(movies: number[]) {
    this.movies = new Set(movies);
    this.movieUsers = {};
    this.movies.forEach((movie) => {
      this.movieUsers[movie] = [];
    });
    this.users.forEach((user) => {
      this.userMovies[user] = [];
    });
  }

  removeUser(user: string) {
    this.users.delete(user);
    delete this.userMovies[user];
    Object.values(this.movieUsers).forEach((users) => {
      users.splice(
        users.findIndex((u) => u.name === user),
        1,
      );
    });
  }

  moviesForUser(user: string) {
    return this.userMovies[user] ?? [];
  }

  usersForMovie(movie: number) {
    return this.movieUsers[movie] ?? [];
  }

  voteForUser(userName: string, movieID: number, vote: boolean) {
    const movies = this.moviesForUser(userName);
    const movie = movies.find((m) => m.id === movieID);
    if (movie) {
      movie.vote = vote;
    }
    const users = this.usersForMovie(movieID);
    const user = users.find((u) => u.name === userName);
    if (user) {
      user.vote = vote;
    }
  }

  toApi() {
    return {
      id: this.id,
      movies: this.moviesSorted,
      users: this.users,
      started: this.isStarted,
    };
  }
}
