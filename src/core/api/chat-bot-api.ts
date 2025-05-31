import { server } from "../config";

export const ChatbotApi = {
    sendMessage: (params?: any) => server.post('/chat-bot/chat', params),
}
