import { debounce } from 'lodash';
import { useEffect } from 'react';
import { socketService } from '../services';
import { useCoreStores } from '../stores';

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

export function useTyping(conversationId: number, inputValue: string) {
    const { sessionStore } = useCoreStores()
    // debounce để giới hạn số lần gửi typing_start
    const sendTypingStart = debounce(() => {
        socketService.socket?.emit('typing_start', { id: conversationId, full_name: sessionStore.profile?.fullname });
    }, 300);

    useEffect(() => {
        if (inputValue) {
            sendTypingStart();
        } else {
            socketService.socket?.emit('typing_end', { id: conversationId, full_name: sessionStore.profile?.fullname });
        }

        return () => {
            sendTypingStart.cancel();
        };
    }, [inputValue]);
}