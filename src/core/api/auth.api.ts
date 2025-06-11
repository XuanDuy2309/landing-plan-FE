import { server } from "../config";

export const AuthApi = {
    login: (params: any) => server.post('/user/login', params),
    register: (params: any) => server.post('/user/register', params),
    getProfile: (params?: any) => server.get('/user/profile', params),
    updateAvatar: (params?: any) => server.put('/user/change_avatar', params),
    updateBackground: (params?: any) => server.put('/user/change_background', params),
    deleteAvatar: (params?: any) => server.delete('/user/delete_avatar', params),
    deleteBackground: (params?: any) => server.delete('/user/delete_background', params),
    getListUpload: (params?: any) => server.get('/auth/list_upload', params),
    getListUploadById: (params?: any) => server.get('/auth/list_upload/' + params.id, params),
    upload: (params?: any) => server.multipartPost('/auth/upload', params),
    updateInfo: (params?: any) => server.put('/user/update', params),
    updatePassword: (params?: any) => server.put('/user/change_password', params),
    follow: (params?: any) => server.post('/user/follow', params),
    unfollow: (params?: any) => server.delete('/user/follow/' + params.id, params),
    getFollowing: (params?: any) => server.get('/user/followings', params),
    getFollowers: (params?: any) => server.get('/user/followers', params),
    checkFollow: (params?: any) => server.get('/user/check_follow', params),
    getListUser: (params?: any) => server.get('/user', params),
    getDetailUser: (params?: any) => server.get('/user/' + params.id, params),
    deleteUpload: (id?: number) => server.delete('/auth/delete/' + id),
}