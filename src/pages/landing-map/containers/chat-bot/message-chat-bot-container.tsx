import { observer } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize'
import { ChatBotModel } from 'src/core/models/chat-bot-model'
import { useListChatbotContext } from 'src/core/modules'
import { ChatBotHeader } from '../../components/chat-bot/chat-bot-header'
import { ListMessageChatBotContainer } from './list-message-chat-bot-container'

export const MessageChatBotContainer = observer(() => {
    const { data, message, loading, handleSendMessage } = useListChatbotContext()

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault()
            const temp = new ChatBotModel()
            temp.message = message.message
            temp.isMine = true
            data.push(temp)
            Object.assign(message, new ChatBotModel())
            const res = await handleSendMessage(temp)
            if (res.Status) {
            }
        }
    }

    return (
        <div
            className='h-[350px] w-[300px] rounded-[4px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] min-h-0 flex flex-col'
        >
            <ChatBotHeader />
            <ListMessageChatBotContainer />
            <div className='w-full flex items-end px-2 py-2 border-t border-gray-200 bg-white flex-none'>
                <div className='w-full h-full min-h-[32px] flex items-center bg-gray-100 rounded-2xl px-4 mr-2'>
                    <TextareaAutosize
                        value={message.message || ''}
                        placeholder={"Aa"}
                        className="w-full max-h-[150px]  bg-transparent outline-none placeholder:text-gray-500 text-md"
                        onChange={(e) => message.message = e.target.value}
                        onKeyDown={handleKeyDown}
                        // onPaste={handlePaste}
                        disabled={loading}
                    />

                </div>
            </div>
        </div>
    )
}
)
