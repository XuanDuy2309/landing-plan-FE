import { Popover, Spin, Tooltip, message } from "antd"
import { observer } from "mobx-react"
import moment from "moment"
import { useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Colors } from "src/assets"
import { IconBase } from "src/components"
import { getColorFromId } from "src/core/base"
import { useSocketEvent } from "src/core/hook"
import { MessageModel, MessageType } from "src/core/models"
import { useListMessageContext, useManagerConversationContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"

interface IProps {
    messages: MessageModel[]
    currentUserId: number
    onImageClick?: (url: string) => void
    onFileClick?: (url: string) => void
    onReply?: (message: MessageModel) => void
    onForward?: (message: MessageModel) => void
    onReaction?: (messageId: number, emoji: string) => void
    loading?: boolean
}

export const ListMessageContent = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { selectedId } = useManagerConversationContext()
    const { sessionStore } = useCoreStores()
    const { data, loading, fetchMore, hasMore, onRefresh } = useListMessageContext()

    useSocketEvent<MessageModel>('new_message', (mess) => {
        if (mess.conversation_id === selectedId) {
            // Add is_new flag for animation
            mess.is_new = true;
            data.unshift(mess)
            
            // Remove the is_new flag after animation completes
            setTimeout(() => {
                mess.is_new = false;
            }, 500);
        }
    })

    const isMyMessage = (senderId: number) => senderId === sessionStore.profile?.id

    const groupMessagesByDate = (messages: MessageModel[]) => {
        const groups: { [key: string]: MessageModel[] } = {}

        messages.forEach(message => {
            const date = moment(message.created_at).format('YYYY-MM-DD')
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(message)
        })

        return groups
    }

    const handleCopyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            message.error("Không thể sao chép văn bản!")
        }
    }

    const renderFilePreview = (message: MessageModel) => {
        if (!message.content) return null

        if (message.type === MessageType.IMAGE) {
            return (
                <div
                    className="max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity"
                // onClick={() => onImageClick?.(message.content!)}
                >
                    <img
                        src={message.content}
                        alt="Message image"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            )
        }

        return (
            <div
                className="flex items-center space-x-2 bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            // onClick={() => onFileClick?.(message.content!)}
            >
                <IconBase
                    icon="document-outline"
                    size={24}
                    color={Colors.gray[600]}
                />
                <span className="text-sm text-gray-600 max-w-[150px] truncate">
                    {message.content || 'File đính kèm'}
                </span>
            </div>
        )
    }

    const renderReplyPreview = (replyMessage: MessageModel) => {
        return (
            <div className="mb-1 px-2 py-1 bg-gray-50 rounded border-l-2 border-gray-300 text-sm text-gray-600">
                <div className="font-medium">
                    {isMyMessage(replyMessage.sender_id || 0) ? 'Bạn' : 'Người gửi'}
                </div>
                <div className="truncate">
                    {replyMessage.content || (replyMessage.type === MessageType.IMAGE ? '🖼️ Hình ảnh' : '📎 File đính kèm')}
                </div>
            </div>
        )
    }

    const renderMessage = (message: MessageModel, index: number, messages: MessageModel[]) => {
        const isMine = isMyMessage(message.sender_id || 0)
        const prevMessage = index > 0 ? messages[index - 1] : null
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
        const isSequence = prevMessage?.sender_id === message.sender_id
        const isEndOfSequence = nextMessage?.sender_id !== message.sender_id

        return (
            <div
                key={message.id}
                className={`flex items-end space-x-2 group transition-all ${
                    isMine ? 'flex-row-reverse' : 'flex-row'
                } ${isSequence ? 'mt-1' : 'mt-4'} ${
                    message.is_new ? 'animate-fade-in' : ''
                }`}
            >
                {/* Avatar */}
                {!isMine && isEndOfSequence && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mb-5 flex items-center justify-center"
                        style={{
                            backgroundColor: getColorFromId(message.sender_id || 0)
                        }}
                    >
                        {
                            message.sender_avatar ?
                                <img src={message.sender_avatar} alt="" className="w-full h-full object-cover" />
                                :
                                <span className="text-2xl font-bold text-white">{message.sender_name?.charAt(0).toUpperCase()}</span>
                        }
                    </div>
                )}

                {!isMine && !isEndOfSequence && <div className="w-8 flex-shrink-0" />}

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[60%] relative group`}>

                    {/* Message actions */}
                    <div className={`absolute ${isMine ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 hidden group-hover:flex items-center space-x-1 px-2`}>
                        <Popover
                            content={
                                <div style={{ width: 350 }}>
                                </div>
                            }
                            trigger="click"
                            placement={isMine ? "left" : "right"}
                        >
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                                <IconBase icon="emoji-outline" size={16} color={Colors.gray[600]} />
                            </button>
                        </Popover>
                        <button
                            className="p-1 hover:bg-gray-100 rounded-full"
                        // onClick={() => onReply?.(message)}
                        >
                            <IconBase icon="reply-outline" size={16} color={Colors.gray[600]} />
                        </button>
                        <button
                            className="p-1 hover:bg-gray-100 rounded-full"
                        // onClick={() => onForward?.(message)}
                        >
                            <IconBase icon="forward-outline" size={16} color={Colors.gray[600]} />
                        </button>
                        {message.content && (
                            <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onClick={() => handleCopyText(message.content!)}
                            >
                                <IconBase icon="copy-outline" size={16} color={Colors.gray[600]} />
                            </button>
                        )}
                    </div>

                    {/* File/Image preview */}
                    {message.type !== MessageType.TEXT && (
                        <div className="mb-1">
                            {renderFilePreview(message)}
                        </div>
                    )}
                    {message.type === MessageType.TEXT && <div className="relative">
                        {message.content && (
                            <div
                                className={`px-4 py-2 rounded-2xl break-words select-text ${isMine
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    } ${isMine
                                        ? isSequence
                                            ? isEndOfSequence
                                                ? 'rounded-tr-none'
                                                : 'rounded-tr-none rounded-br-none'
                                            : 'rounded-tr-none'
                                        : isSequence
                                            ? isEndOfSequence
                                                ? 'rounded-tl-none'
                                                : 'rounded-tl-none rounded-bl-none'
                                            : 'rounded-tl-none'
                                    }`}
                            >
                                {message.content}
                            </div>
                        )}
                    </div>}

                    {/* Timestamp and read status */}
                    {isEndOfSequence && (
                        <div className="flex items-center space-x-1 mt-1">
                            <Tooltip
                                title={moment(message.created_at).format('HH:mm DD/MM/YYYY')}
                                placement={isMine ? 'left' : 'right'}
                            >
                                <span className="text-xs text-gray-500">
                                    {moment(message.created_at).format('HH:mm')}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const messageGroups = groupMessagesByDate(data)

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div id="list-mess" className="w-full h-full overflow-y-auto px-4 py-4 bg-white"
            style={{
                minHeight: '0',
                display: 'flex',
                flexDirection: 'column-reverse',
            }}
            ref={containerRef}>
            <InfiniteScroll
                next={fetchMore}
                hasMore={hasMore()}
                loader={<Spin />}
                dataLength={data.length}
                scrollableTarget="list-mess"
                inverse={true}
                scrollThreshold={-50}
                className="flex flex-col-reverse"
            >
                {Object.entries(messageGroups).map(([date, messages]) => (
                    <div key={date}>
                        <div className="flex justify-center my-4">
                            <div className="px-3 py-1  text-sm text-gray-600">
                                {moment(date).calendar(null, {
                                    sameDay: '[Hôm nay]',
                                    lastDay: '[Hôm qua]',
                                    lastWeek: 'DD/MM/YYYY',
                                    sameElse: 'DD/MM/YYYY'
                                })}
                            </div>
                        </div>
                        {messages.sort((a, b) => -1).map((message, index, arr) => {
                            return renderMessage(message, index, arr)
                        })}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
})

// Add these styles to your CSS
const styles = `
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
`