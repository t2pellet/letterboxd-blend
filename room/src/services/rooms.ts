import Room from '@/models/room';
import * as crypto from 'crypto';

const rooms: Record<string, Room> = {};

export default class RoomsService {
  public rooms: Record<string, Room> = {};

  private static instance: RoomsService;
  public static getInstance(): RoomsService {
    if (!this.instance) this.instance = new RoomsService();
    return this.instance;
  }

  hasRoom(id: string) {
    return !!this.rooms[id];
  }

  createRoom(user: string): Room {
    const id = this.generateCode();
    const room = new Room(id, user);
    this.rooms[id] = room;
    return room;
  }

  getRoom(id: string) {
    return this.rooms[id];
  }

  deleteRoom(id: string) {
    delete rooms[id];
  }

  private generateCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
      .slice(0, 8);
  }
}
