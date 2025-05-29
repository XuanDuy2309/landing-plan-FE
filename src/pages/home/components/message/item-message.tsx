import { Dropdown, MenuProps, Tooltip } from "antd"
import classNames from "classnames"
import { observer } from "mobx-react"
import moment from "moment"
import { useRef } from "react"
import { toast } from "react-toastify"
import { Colors } from "src/assets"
import { IconBase } from "src/components"
import { ModalConfirm } from "src/components/modal-confirm/modal-confim"
import { getColorFromId } from "src/core/base"
import { MessageModel, MessageType } from "src/core/models"
import { useListMessageContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"

interface IProps {
    message: MessageModel
    index: number
    messages: MessageModel[]
}

export const ItemMessage = observer(({ message, index, messages }: IProps) => {
    const { sessionStore } = useCoreStores()
    const isMyMessage = (senderId: number) =>
        senderId === sessionStore.profile?.id
    const isMine = isMyMessage(message.sender_id || 0)
    const prevMessage = index > 0 ? messages[index - 1] : null
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
    const isSequence = prevMessage?.sender_id === message.sender_id
    const isEndOfSequence = nextMessage?.sender_id !== message.sender_id
    const { setItemUpdate, itemUpdate, onDeleteMessage, setReplyMess, setCopyMess } = useListMessageContext()
    const modalRef = useRef<any>(null)

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: "Sửa tin nhắn",
            onClick: () => {
                setItemUpdate(message)
            }
        },
        {
            key: '2',
            label: 'Xoá tin nhắn',
            onClick: () => {
                modalRef.current?.open()
            },
            danger: true
        }
    ]

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(message.content || '')
            setCopyMess(message)
        } catch (err) {
            toast.error("Không thể sao chép văn bản!")
        }
    }

    const renderFilePreview = (type: MessageType, content: string) => {
        if (!content) return null

        if (type === MessageType.IMAGE) {
            return (
                <div className="max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                        src={content}
                        alt="Message image"
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            )
        }

        if (type === MessageType.VIDEO) {
            return (
                <div className="max-w-[400px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden">
                    <video
                        src={content}
                        controls
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            )
        }

        return (
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <IconBase icon="file-outline" size={24} color={Colors.gray[600]} />
                <span className="text-sm text-gray-600 max-w-[150px] truncate">
                    {content || 'File đính kèm'}
                </span>
            </div>
        )
    }
    return (

        <div
            key={message.id}
            className={classNames("relative",
                {
                    'mt-1': isSequence
                },
                {
                    'mt-4': !isSequence
                },)}>
            {message.reply_id && (
                <div className={classNames("flex items-center space-x-2",
                    {
                        'justify-end': isMine
                    },
                    {
                        'ml-10': !isMine
                    }
                )}>
                    <IconBase icon="share-outline" size={16} color={Colors.gray[600]} />
                    {isMine ? (
                        <span>Bạn đã trả lời {isMyMessage(message.reply_sender_id || 0) ? "chính mình" : message.reply_sender_name}</span>
                    ) : (
                        <span>{message.sender_name} đã trả lời tin nhắn của {isMyMessage(message.reply_sender_id || 0) ? "bạn" : message.reply_sender_name}</span>
                    )}

                </div>
            )}
            {message.reply_type === MessageType.TEXT && message.reply_id && (

                <div className={classNames("flex items-start space-x-2 group transition-all relative",
                    {
                        'flex-row-reverse': isMine
                    },
                    {
                        'ml-10': !isMine
                    },
                    {
                        'animate-fade-in': message.is_new
                    })
                }>
                    <div
                        className={`px-4 py-2 rounded-2xl break-words select-text ${isMine ? 'bg-gray-200' : 'bg-gray-200'}`}
                    >
                        <span className="whitespace-pre-line">{message.reply_content}</span>
                    </div>

                </div>
            )}

            {message.reply_type !== MessageType.TEXT && message.reply_id && (
                <div className={classNames("mb-1 flex items-start",
                    {
                        'flex-row-reverse': isMine
                    },
                    {
                        'ml-10': !isMine
                    },
                    {
                        'animate-fade-in': message.is_new
                    })}>
                    {renderFilePreview(message.reply_type || MessageType.TEXT, message.reply_content || '')}
                </div>
            )}

            <div className={classNames("flex items-start space-x-2 group transition-all relative ",
                {
                    "-mt-2": message.reply_id
                },
                {
                    'flex-row-reverse': isMine
                },
                {
                    'animate-fade-in': message.is_new
                })
            }  >


                {
                    !isMine && isEndOfSequence && (
                        <div
                            className="w-8 h-8 mt-2 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 mb-5 flex items-center justify-center"
                            style={{ backgroundColor: getColorFromId(message.sender_id || 0) }}
                        >
                            {message.sender_avatar ? (
                                <img src={message.sender_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-white">
                                    {message.sender_name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    )
                }
                {!isMine && !isEndOfSequence && <div className="w-8 flex-shrink-0" />}

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[60%] relative group`}>
                    {/* Message actions */}
                    <div className={`absolute ${isMine ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-1/2 hidden group-hover:flex items-center space-x-1 px-2`}>
                        <button className="p-1 flex-none hover:bg-gray-100 rounded-full cursor-pointer"
                            onClick={() => setReplyMess(message)}
                        >
                            <IconBase icon="share-outline" size={16} color={Colors.gray[600]} />
                        </button>
                        {message.content && (
                            <button className="p-1 flex-none hover:bg-gray-100 rounded-full"
                                onClick={() => handleCopyText()}
                            >
                                <IconBase icon="copy-outline" size={16} color={Colors.gray[600]} />
                            </button>
                        )}
                        {message.content && message.type === MessageType.TEXT && isMyMessage(message.sender_id || 0) && (
                            <Dropdown trigger={['click']} menu={{ items }}>
                                <button className="p-1 flex-none hover:bg-gray-100 rounded-full">
                                    <IconBase icon="more-2" size={16} color={Colors.gray[600]} />
                                </button>
                            </Dropdown>
                        )}
                    </div>

                    {/* File/Image preview */}
                    {message.type !== MessageType.TEXT && (
                        <Tooltip
                            title={moment(message.created_at).format('HH:mm DD/MM/YYYY')}
                            placement={isMine ? 'left' : 'right'}
                        >
                            <div className="mb-1">
                                {renderFilePreview(message.type, message.content || '')}
                            </div>
                        </Tooltip>
                    )}

                    {/* Text message */}
                    {message.type === MessageType.TEXT && (
                        <Tooltip
                            title={moment(message.created_at).format('HH:mm DD/MM/YYYY')}
                            placement={isMine ? 'left' : 'right'}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl break-words select-text ${isMine
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'}`}
                            >
                                <span className="whitespace-pre-line">{message.content}</span>
                            </div>
                        </Tooltip>
                    )}
                </div>
                <ModalConfirm
                    ref={modalRef}
                    label="Xoá tin nhắn"
                    onConfirm={async () => {
                        modalRef.current?.close()
                        await onDeleteMessage(message.conversation_id, message.id)
                    }}
                    onCancel={() => modalRef.current?.close()}
                />
            </div >
        </div>
    )
})