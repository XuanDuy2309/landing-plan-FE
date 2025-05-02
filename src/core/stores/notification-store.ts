// stores/NotificationStore.ts
import { makeAutoObservable } from "mobx";

export class NotificationStore {
  notifications: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNotification(message: string) {
    this.notifications.unshift(message);
  }

  clearNotifications() {
    this.notifications = [];
  }
}
