import axios, { Axios } from "axios";
import env from "@/constants/env";

export default class RoomService {
  private service: Axios;
  public constructor(private user: string) {
    this.service = axios.create({ baseURL: `${env.RoomServiceURL}/api` });
    this.service.defaults.headers.common["X-Letterboxd-User"] = user;
  }

  async createRoom(movies: number[]) {
    await this.service.post("/", {
      movies,
    });
  }

  async getRoom(id: string) {
    await this.service.get(`/${id}`);
  }

  async deleteRoom(id: string) {
    await this.service.delete(`/${id}`);
  }
}
