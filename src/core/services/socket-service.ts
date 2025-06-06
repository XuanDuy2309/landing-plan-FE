// services/SocketService.ts
import { makeObservable, observable } from "mobx";
import { io, Socket } from "socket.io-client";
import { baseUrl } from "../config";

class SocketService {
  @observable socket?: Socket;

  constructor() {
    makeObservable(this)
  }

  connect(token: string) {
    this.socket = io(baseUrl, {
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected!");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
