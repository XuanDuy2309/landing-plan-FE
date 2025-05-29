
import { Dropdown, MenuProps } from "antd"
import { observer } from "mobx-react"
import TextareaAutosize from 'react-textarea-autosize'
import { Colors } from "src/assets"
import { IconBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { useSocketEvent, useTyping } from "src/core/hook"
import { MessageType } from "src/core/models"
import { useCreateMessageContext, useListMessageContext, useManagerConversationContext } from "src/core/modules"
import { SelectFileCase } from "src/core/services"

export const InputContentMessageContainer = observer(() => {
    const { data, loading, onSubmit, onUpload, onClear } = useCreateMessageContext()
    const { itemUpdate, setItemUpdate, replyMess, setReplyMess, copyMess } = useListMessageContext()
    const { selectedId } = useManagerConversationContext()

    useSocketEvent('message_edited', (mess) => {
        if (mess.conversation_id === itemUpdate?.conversation_id) {
            setItemUpdate(undefined)
        }
    })

    useTyping(selectedId || 0, data.content || '');


    const handleSendLike = async () => {
        data.content = "👍"
        data.type = MessageType.TEXT
        const res = await onSubmit()
        if (res.Status) {
            onClear()
        }
    }

    const handleSendMessage = async () => {
        if (!data.content) {
            return
        }
        if (data.content) {
            const res = await onSubmit()
            if (res.Status) {
                onClear()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleUpload = async (type: MessageType) => {
        console.log(type)
        const input = new SelectFileCase(type || 'file', false);
        await input.process()
            .then(res => {
                if (res.length > 0) { onUpload(res[0], type); }
            })
            .catch(err => console.log(err));
    }

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items)
        const imageItem = items.find(item => item.type.indexOf('image') !== -1)

        Object.assign(data, copyMess)

        if (imageItem) {
            e.preventDefault()
            const file = imageItem.getAsFile()
            if (!file) return

            if (file.size > 5 * 1024 * 1024) {
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                data.content = reader.result as string
                data.type = MessageType.IMAGE
            }
            reader.readAsDataURL(file)
        }
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Hình ảnh',
            onClick: () => {
                handleUpload(MessageType.IMAGE)
            }
        },
        {
            key: '2',
            label: 'Video',
            onClick: () => {
                handleUpload(MessageType.VIDEO)
            }
        },
    ]

    return (
        <div className="w-full flex flex-col justify-end">

            {itemUpdate &&
                <div className="w-full p-3 border-t border-gray-100 relative">
                    <span>Sửa tin nhắn</span>
                    <ButtonIcon icon="close-outline" iconSize="16" color={Colors.gray[700]}
                        onClick={() => {
                            setItemUpdate(undefined)
                        }}
                        className="absolute top-0 right-0" />
                </div>
            }
            {replyMess &&
                <div className="w-full p-3 border-t border-gray-100 relative">
                    <div className="flex flex-col space-x-0.5">
                        <span className="text-gray-700 text-base font-medium">Trả lời tin nhắn của {replyMess.sender_name}</span>
                        <span className="text-gray-500 text-xs line-clamp-1">{replyMess.content}</span>
                    </div>
                    <ButtonIcon icon="close-outline" iconSize="16" color={Colors.gray[700]}
                        onClick={() => {
                            setReplyMess(undefined)
                        }}
                        className="absolute top-0 right-0" />
                </div>
            }
            {/* Input area */}
            <div className="w-full flex items-end px-4 py-2 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">


                    {/* Image input */}
                    <Dropdown trigger={['click']} menu={{ items }}>
                        <div className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <IconBase
                                icon="image-outline"
                                size={20}
                                color={Colors.gray[600]}
                            />
                        </div>
                    </Dropdown>

                    {/* Document input */}
                    <div className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={() => {
                            handleUpload(MessageType.FILE)
                        }}
                    >
                        <IconBase
                            icon="attachfile-outline"
                            size={20}
                            color={Colors.gray[600]}
                        />
                    </div>

                </div>
                <div className="w-full h-full flex items-center bg-gray-100 rounded-2xl px-4 mr-2">
                    {data.type !== MessageType.TEXT ? (
                        <div className="w-full py-2 border-t border-gray-200   relative">
                            {data.type === MessageType.IMAGE && (
                                <img
                                    src={data.content || ''}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded"
                                />
                            )}
                            {data.type === MessageType.VIDEO && (
                                <video src={data.content || ''} className="w-20 h-20 object-cover rounded" controls />
                            )}
                            {data.type === MessageType.FILE && (
                                <div className="flex items-center space-x-2 p-2">
                                    <IconBase
                                        icon="document-outline"
                                        size={24}
                                        color={Colors.gray[600]}
                                    />
                                    <span className="text-sm text-gray-600">{data.content}</span>
                                </div>
                            )}
                            <ButtonIcon icon="close-outline" iconSize="16" color={Colors.gray[700]} onClick={() => { onClear() }} className="absolute top-0 right-0" />
                        </div>
                    ) :
                        <TextareaAutosize
                            value={data.content || ''}
                            placeholder={"Aa"}
                            className="w-full max-h-[150px] bg-transparent outline-none placeholder:text-gray-500 text-md"
                            onChange={(e) => data.content = e.target.value}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            disabled={loading}
                        />
                    }
                </div>

                {/* Send button */}
                {data.content ? <button
                    className={`p-2 rounded-full transition-colors ${data.content && !loading
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-200"
                        }`}
                    onClick={handleSendMessage}
                    disabled={(!data.content) || loading}
                >
                    <IconBase
                        icon={loading ? "loading-outline" : "send-outline"}
                        size={20}
                        color={data.content && !loading ? Colors.white : Colors.gray[400]}
                        className={loading ? "animate-spin" : ""}
                    />
                </button> :
                    <button
                        className={`p-2 transition-colors rounded-full hover:bg-gray-100`}
                        onClick={handleSendLike}
                        disabled={loading}
                    >
                        <IconBase
                            icon={'like-outline'}
                            size={20}
                            color={Colors.blue[600]}
                        />
                    </button>
                }
            </div>
        </div>
    )
})