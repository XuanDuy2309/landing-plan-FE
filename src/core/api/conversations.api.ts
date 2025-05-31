import { server } from "../config";

export const ConversationsApi = {
    getListCoversation: (params?: any) => server.get('/conversations', params),
    addConversation: (params?: any) => server.post('/conversations', params),
    updateConversation: (id: number, params?: any) => server.put(`/conversations/${id}`, params),
    getDetailConversation: (id: number) => server.get(`/conversations/${id}`),
    deleteConversation: (id: number) => server.delete(`/conversations/${id}`),

    getListMessage: (id: number, params?: any) => server.get(`/conversations/${id}/messages`, params),
    sendMessage: (id: number, params?: any) => server.post(`/conversations/${id}/messages`, params),
    updateMessage: (idConversation: number, idMessage: number, params?: any) => server.put(`/conversations/${idConversation}/messages/${idMessage}`, params),
    deleteMessage: (idConversation: number, idMessage: number, params?: any) => server.delete(`/conversations/${idConversation}/messages/${idMessage}`, params),

    getListMember: (id: number, params?: any) => server.get(`/conversations/${id}/users`, params),
    addMember: (id: number, params?: any) => server.post(`/conversations/${id}/members`, params),
    removeMember: (id: number, id_member: number, params?: any) => server.delete(`/conversations/${id}/members/${id_member}`, params),
    updateRoleMember: (id: number, id_member: number, params?: any) => server.patch(`/conversations/${id}/members/${id_member}/role`, params),
    updateMuteMember: (id: number, params?: any) => server.patch(`/conversations/${id}/setting`, params),
}