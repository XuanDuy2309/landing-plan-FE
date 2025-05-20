import { server } from "../config";

export const ConversationsApi = {
    getListCoversation: (params?: any) => server.get('/conversations', params),
    addConversation: (params?: any) => server.post('/conversations', params),
    getDetailConversation: (id: number) => server.get(`/conversations/${id}`),

    getListMessage: (id: number, params?: any) => server.get(`/conversations/${id}/messages`, params),
    sendMessage: (id: number, params?: any) => server.post(`/conversations/${id}/messages`, params),
    updateMessage: (idConversation: number, idMessage: number, params?: any) => server.put(`/conversations/${idConversation}/messages/${idMessage}`, params),
    deleteMessage: (idConversation: number, idMessage: number, params?: any) => server.delete(`/conversations/${idConversation}/messages/${idMessage}`, params),

    getMentionConversation: (id: number, params?: any) => server.get(`/conversations/${id}/mentions/users`, params),

}