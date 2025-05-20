// services/SocketService.ts
import { makeObservable, observable } from "mobx";
import { io, Socket } from "socket.io-client";

class SocketService {
  @observable socket?: Socket;

  constructor() {
    makeObservable(this)
  }

  connect(token: string) {
    this.socket = io("https://landing-plan-be.onrender.com", {
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
