import { server } from "../config";

export const PostApi = {
    getListPost: (params?: any) => server.get('/post', params),
    getDetailPost: (params?: any) => server.get('/post/' + params.id, params),
    createPost: (params?: any) => server.post('/post', params),
    updatePost: (params?: any) => server.put('/post/' + params.id, params),
    deletePost: (params?: any) => server.delete('/post/' + params.id),
    sharePost: (params?: any) => server.post('/post/share/'+params.id, params),
    likePost: (params?: any) => server.post('/post/like/'+params.id, params),
    unlike: (params?: any) => server.delete('/post/like/'+params.id, params),
}