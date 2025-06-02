import { Spin } from "antd"
import { observer } from "mobx-react"
import moment from "moment"
import { useCallback, useRef, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSocketEvent } from "src/core/hook"
import { MessageModel, MessageType, UserModel } from "src/core/models"
import {
    useListMessageContext,
    useManagerConversationContext
} from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { ItemMessage } from "../../components/message/item-message"

interface TypingType {
    typer_id: number
    typer_name: string
    conversationId: number
    isTyping: boolean
}

export const ListMessageContent = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { selectedId } = useManagerConversationContext()
    const { sessionStore } = useCoreStores()
    const { data, loading, fetchMore, hasMore, indexPage } = useListMessageContext()
    const [typing, setTyping] = useState<TypingType>();

    useSocketEvent<MessageModel>('new_message', (mess) => {
        if (mess.conversation_id === selectedId) {
            mess.is_new = true
            data.unshift(mess)
            setTimeout(() => {
                mess.is_new = false
            }, 500)
        }
    })

    useSocketEvent('message_edited', (mess) => {
        if (mess.conversation_id === selectedId) {
            data.forEach((item, index) => {
                if (item.id === mess.id) {
                    data[index] = mess
                }
            })
        }
    })

    useSocketEvent('message_deleted', (mess) => {
        if (mess.conversation_id === selectedId) {
            data.forEach((item, index) => {
                if (item.id === mess.id) {
                    data[index] = mess
                }
            })
        }
    })

    // Thêm thành viên mới
    useSocketEvent('member_added', (payload: { conversation_id: number, user: UserModel, by_user: UserModel }) => {
        if (payload.conversation_id === selectedId) {
            const systemMessage = new MessageModel()
            systemMessage.type = MessageType.SYSTEM
            systemMessage.content = `${payload.by_user.nickname || payload.by_user.fullname} đã thêm ${payload.user.nickname || payload.user.fullname} vào nhóm`
            systemMessage.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
            systemMessage.conversation_id = selectedId
            data.unshift(systemMessage)
        }
    })

    // Xóa thành viên
    useSocketEvent('member_removed', (payload: { conversation_id: number, user: UserModel, by_user: UserModel }) => {
        if (payload.conversation_id === selectedId) {
            const systemMessage = new MessageModel()
            systemMessage.type = MessageType.SYSTEM
            systemMessage.content = `${payload.by_user.nickname || payload.by_user.fullname} đã xóa ${payload.user.nickname || payload.user.fullname} khỏi nhóm`
            systemMessage.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
            systemMessage.conversation_id = selectedId
            data.unshift(systemMessage)
        }
    })

    // Thành viên rời nhóm
    useSocketEvent('member_left', (payload: { conversation_id: number, user: UserModel }) => {
        if (payload.conversation_id === selectedId) {
            const systemMessage = new MessageModel()
            systemMessage.type = MessageType.SYSTEM
            systemMessage.content = `${payload.user.nickname || payload.user.fullname} đã rời khỏi nhóm`
            systemMessage.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
            systemMessage.conversation_id = selectedId
            data.unshift(systemMessage)
        }
    })

    const handler = useCallback((data: TypingType) => {
        setTyping(data)
    }, []);
    useSocketEvent('user_typing', handler);

    const groupMessagesByDate = (messages: MessageModel[]) => {
        const groups: { [key: string]: MessageModel[] } = {}
        messages.forEach(message => {
            const date = moment(message.created_at).format('YYYY-MM-DD')
            if (!groups[date]) groups[date] = []
            groups[date].push(message)
        })
        return groups
    }



    const messageGroups = groupMessagesByDate(data)

    if (loading && data.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }
    return (
        <>
            <div
                id={"list_mess"}
                className="w-full h-full overflow-y-auto px-4 py-4 bg-white"
                style={{ minHeight: '0', display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto' }}
                ref={containerRef}
            >
                <InfiniteScroll
                    next={() => {
                        fetchMore()

                    }}
                    hasMore={hasMore()}
                    loader={<Spin />}
                    dataLength={data.length}
                    scrollableTarget={"list_mess"}
                    inverse={true}
                    className="flex flex-col-reverse"
                >
                    {Object.entries(messageGroups).map(([date, messages]) => (
                        <div key={date}>
                            <div className="flex justify-center my-4">
                                <div className="px-3 py-1 text-sm text-gray-600">
                                    {moment(date).calendar(null, {
                                        sameDay: '[Hôm nay]',
                                        lastDay: '[Hôm qua]',
                                        lastWeek: 'DD/MM/YYYY',
                                        sameElse: 'DD/MM/YYYY',
                                    })}
                                </div>
                            </div>
                            {messages.sort((a, b) => -1).map((message, index, arr) => (

                                <ItemMessage key={message.id} message={message} index={index} messages={arr} />
                            ))}
                        </div>
                    ))}
                </InfiniteScroll>

            </div>
            {typing && typing.isTyping && <div className="w-full px-3 py-1 text-lmd text-gray-700 bg-white flex items-center justify-end space-x-2">
                <span>{typing?.typer_name} đang soạn tin</span>
                <div className="flex space-x-1">
                    <span className="size-1 bg-gray-500 rounded-full flex-none animate-bounce [animation-delay:0s]" />
                    <span className="size-1 bg-gray-500 rounded-full flex-none animate-bounce [animation-delay:0.2s]" />
                    <span className="size-1 bg-gray-500 rounded-full flex-none animate-bounce [animation-delay:0.4s]" />
                </div>
            </div>}
        </>
    )
})

// 👉 CSS (style file or global CSS)
/*
@keyframes newMessageFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    50% {
        opacity: 0.5;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: newMessageFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    will-change: transform, opacity;
}
*/
