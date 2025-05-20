import { useEffect } from 'react';
import { socketService } from '../services';

export function usePostSocketRoom(postId?: number | string) {
    useEffect(() => {
        if (!postId) return;

        if (!socketService.socket) return
        socketService.socket.emit('join_post_room', postId); // 👈 Tham gia phòng

        return () => {
            socketService.socket?.emit('leave_post_room', postId); // 👈 Thoát phòng khi unmount
        };
    }, [postId]);
}

export function useSocketEvent<T = any>(event: string, handler: (data: T) => void) {
    useEffect(() => {
        socketService.socket?.on(event, handler);

        return () => {
            socketService.socket?.off(event, handler); // Cleanup khi unmount
        };
    }, [event, handler]);
}

export const useJoinToConversationRoom = (roomId: number | string) => {
    useEffect(() => {
        if (!roomId) return;
        console.log('roomId', roomId)

        if (!socketService.socket) return
        socketService.socket.emit('join_conversation', { id: roomId }); // 👈 Tham gia phòng

        return () => {
            socketService.socket?.emit('leave_conversation', { id: roomId }); // 👈 Thoát phòng khi unmount
        };
    }, [roomId]);
}