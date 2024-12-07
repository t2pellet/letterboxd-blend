import axios, { Axios } from "axios";
import env from "@/constants/env";
import List from "@/types/scraper";

export default class Scraper {
  private static instance: Scraper;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Scraper();
    }
    return this.instance;
  }

  private service: Axios;
  constructor() {
    this.service = axios.create({ baseURL: env.ScrapeServiceURL });
  }

  async exists(user: string) {
    return this.service.get(`/user/${user}/exists`);
  }

  async avatar(user: string) {
    return this.service.get(`/user/${user}/avatar`);
  }

  async watchlist(user: string) {
    return this.service.get<any, List>(`/user/${user}/watchlist`);
  }

  async watched(user: string) {
    return this.service.get<any, List>(`/user/${user}/watched`);
  }

  async followers(user: string) {
    return this.service.get(`/user/${user}/followers`);
  }

  async following(user: string) {
    return this.service.get(`/user/${user}/following`);
  }

  async ids(slugs: string[]) {
    return this.service.get<any, { slug: string; id: string }[]>(`/movie/ids`, {
      params: {
        slugs,
      },
    });
  }
}
