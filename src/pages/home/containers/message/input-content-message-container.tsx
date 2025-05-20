
import { observer } from "mobx-react"
import { useState } from "react"
import TextareaAutosize from 'react-textarea-autosize'
import { Colors } from "src/assets"
import { IconBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { useCreateMessageContext } from "src/core/modules"

interface FilePreview {
    file: File
    type: 'image' | 'document'
    preview?: string
}

interface Props {
    onSendMessage?: (content: string) => void
    onSendFile?: (file: File) => void
    loading?: boolean
}

export const InputContentMessageContainer = observer(() => {
    const [content, setContent] = useState("")
    const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const { data, loading, onSubmit } = useCreateMessageContext()

    const handleSendMessage = async () => {
        if (!data.content?.trim() && !filePreview) {
            return
        }
        if (filePreview) {
            setFilePreview(null)
        }
        if (data.content?.trim()) {
            const res = await onSubmit()
            if (res.Status) {
                data.content = undefined
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            return
        }

        if (type === 'image') {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFilePreview({
                    file,
                    type,
                    preview: reader.result as string
                })
            }
            reader.readAsDataURL(file)
        } else {
            setFilePreview({
                file,
                type
            })
        }

        e.target.value = ""
    }

    const handleRemovePreview = () => {
        setFilePreview(null)
    }

    const handleEmojiSelect = (emoji: any) => {
        setContent(prev => prev + emoji.native)
        setEmojiPickerOpen(false)
    }

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items)
        const imageItem = items.find(item => item.type.indexOf('image') !== -1)

        if (imageItem) {
            e.preventDefault()
            const file = imageItem.getAsFile()
            if (!file) return

            if (file.size > 5 * 1024 * 1024) {
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setFilePreview({
                    file,
                    type: 'image',
                    preview: reader.result as string
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const autoResize = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = "auto"; // Reset trước
        textarea.style.height = textarea.scrollHeight + "px"; // Set lại theo nội dung
    };

    return (
        <div className="w-full flex flex-col justify-end">

            {/* Input area */}
            <div className="w-full flex items-end px-4 py-2 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    {/* Emoji picker */}
                    {/* <Popover
                        content={
                            <div style={{ width: 350 }}>
                            </div>
                        }
                        trigger="click"
                        open={emojiPickerOpen}
                        onOpenChange={setEmojiPickerOpen}
                        placement="topLeft"
                    >
                        <button
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            type="button"
                        >
                            <IconBase
                                icon="emoji-outline"
                                size={20}
                                color={Colors.gray[600]}
                            />
                        </button>
                    </Popover> */}

                    {!filePreview && <>
                        {/* Image input */}
                        <div className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'image')}
                            />
                            <IconBase
                                icon="image-outline"
                                size={20}
                                color={Colors.gray[600]}
                            />
                        </div>

                        {/* Document input */}
                        <div className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                accept=".doc,.docx,.pdf,.xls,.xlsx,.txt,.ppt,.pptx"
                                onChange={(e) => handleFileChange(e, 'document')}
                            />
                            <IconBase
                                icon="attachfile-outline"
                                size={20}
                                color={Colors.gray[600]}
                            />
                        </div>
                    </>}
                </div>
                <div className="w-full h-full flex items-center bg-gray-100 rounded-2xl px-4 mr-2">
                    {filePreview ? (
                        <div className="w-full py-2 border-t border-gray-200   relative">
                            {filePreview.type === 'image' && filePreview.preview ? (
                                <img
                                    src={filePreview.preview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded"
                                />
                            ) : (
                                <div className="flex items-center space-x-2 p-2">
                                    <IconBase
                                        icon="document-outline"
                                        size={24}
                                        color={Colors.gray[600]}
                                    />
                                    <span className="text-sm text-gray-600">{filePreview.file.name}</span>
                                </div>
                            )}
                            <ButtonIcon icon="close-outline" iconSize="16" color={Colors.gray[700]} onClick={handleRemovePreview} className="absolute top-0 right-0" />
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
                        // <textarea
                        //     className="w-full bg-transparent h-full outline-none px-2 py-2"
                        //     placeholder={loading ? "Đang gửi tin nhắn..." : "Nhập tin nhắn..."}
                        //     value={data.content || ''}
                        //     onChange={(e) => {
                        //         data.content = e.target.value
                        //         autoResize(e.target);
                        //     }}
                        //     onKeyDown={handleKeyDown}
                        //     onPaste={handlePaste}
                        //     disabled={loading}
                        // />
                    }
                </div>

                {/* Send button */}
                <button
                    className={`p-2 rounded-full transition-colors ${(data.content?.trim() || filePreview) && !loading
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-200"
                        }`}
                    onClick={handleSendMessage}
                    disabled={(!data.content?.trim() && !filePreview) || loading}
                >
                    <IconBase
                        icon={loading ? "loading-outline" : "send-outline"}
                        size={20}
                        color={(data.content?.trim() || filePreview) && !loading ? Colors.white : Colors.gray[400]}
                        className={loading ? "animate-spin" : ""}
                    />
                </button>
            </div>
        </div>
    )
})