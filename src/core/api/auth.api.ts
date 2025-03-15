import { server } from "../config";

export const AuthApi = {
    login: (params:any) => server.post('/user/login', params),
    register: (params:any) => server.post('/user/register', params),
    getProfile: (params?:any) => server.get('/user/profile', params),
    updateAvatar: (params?:any) => server.put('/user/change_avatar', params),
    updateBackground: (params?:any) => server.put('/user/change_background', params),
    getListImage: (params?:any) => server.get('/auth/list_image', params),
    uploadImage: (params?:any) => server.multipartPost('/auth/upload_image', params),
}