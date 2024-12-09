import axios, { Axios } from "axios";
import env from "@/constants/env";
import { Room } from "@/types/room";

export default class RoomService {
  private service: Axios;
  public constructor(user: string) {
    this.service = axios.create({ baseURL: `${env.RoomServiceURL}/api` });
    this.service.defaults.headers.common["X-Letterboxd-User"] = user;
  }

  async createRoom(): Promise<Room> {
    return this.service.post("/").then((r) => r.data);
  }

  async getRoom(id: string): Promise<Room> {
    return this.service.get(`/${id}`).then((r) => r.data);
  }

  async updateRoom(id: string, movies: number[]): Promise<Room> {
    return this.service.put(`/${id}`, { movies }).then((r) => r.data);
  }

  async deleteRoom(id: string) {
    await this.service.delete(`/${id}`);
  }

  async startRoom(id: string) {
    await this.service.post(`/${id}/start`);
  }
}
