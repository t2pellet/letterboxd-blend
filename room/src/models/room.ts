export interface Movie {
  id: string;
  vote?: boolean;
}

export interface User {
  name: string;
  vote?: boolean;
}

export default class Room {
  public userMovies: Record<string, Movie[]> = {};
  public movieUsers: Record<string, User[]> = {};
  constructor(
    public id: string,
    public movies: string[] = [],
    public users: string[] = [],
  ) {
    users.forEach((u) => {
      this.userMovies[u] = this.movies.map((m) => ({
        id: m,
      }));
    });
    movies.forEach((m) => {
      this.movieUsers[m] = this.users.map((u) => ({
        name: u,
      }));
    });
  }

  get match() {
    const result = Object.entries(this.movieUsers).find(([, users]) => {
      return users.every((u) => u.vote);
    });
    return result ? result[0] : null;
  }

  get moviesSorted() {
    const usersToValue = (users: User[]) =>
      users
        .map((u) => (u.vote === true ? 1 : u.vote === false ? -1 : 0))
        .reduce((res: number, x) => res + x, 0);

    return Object.entries(this.movieUsers)
      .sort(([, users], [, users2]) => {
        return usersToValue(users) - usersToValue(users2);
      })
      .map(([id]) => id);
  }

  addUser(user: string) {
    if (!this.users.includes(user)) {
      this.users.push(user);
      this.userMovies[user] = this.movies.map((m) => ({
        id: m,
      }));
      Object.values(this.movieUsers).forEach((users) => {
        users.push({ name: user });
      });
    }
  }

  removeUser(user: string) {
    this.users = this.users.splice(this.users.indexOf(user), 1);
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

  usersForMovie(movie: string) {
    return this.movieUsers[movie] ?? [];
  }

  voteForUser(userName: string, movieID: string, vote: boolean) {
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
    };
  }
}
