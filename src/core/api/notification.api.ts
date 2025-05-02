import { server } from "../config";

export const NotificationApi = {
    getNotifications: (params) => server.get("/notification", params),
    readNotification: (id: number, params) => server.put(`/notification/${id}`, params),
    readAllNotification: (id: number, params) => server.put(`/notification/read_all`, params),
}