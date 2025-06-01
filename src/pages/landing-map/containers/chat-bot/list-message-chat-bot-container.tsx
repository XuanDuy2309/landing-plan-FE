import { Skeleton } from "antd"
import { observer } from "mobx-react"
import { useListChatbotContext } from "src/core/modules"
import { ItemMessageChatBot } from "../../components/chat-bot/item-message-chat-bot"

export const ListMessageChatBotContainer = observer(() => {
    const { data, message, loading } = useListChatbotContext()
    return (
        <div className="p-3 flex flex-col h-full overflow-y-auto bg-white min-h-0">
            <div className="flex flex-col w-full">
                {data && data.length > 0 && data.map((item, index) => (
                    <ItemMessageChatBot key={index} content={item.message} isBot={!item.isMine} />
                ))}
            </div>
            {loading && (
                <div className="max-w-[60%] w-full">
                    <Skeleton.Node active={true} style={{ width: '162px', height: "46px", borderRadius: "16px", borderBottomLeftRadius: "6px" }} />
                </div>
            )}
            {!loading && data.length === 0 && (
                <div className='w-full h-full flex justify-center items-center'>
                    <span>{"Bạn cần trợ giúp gì không"}</span>
                </div>
            )}
        </div>
    )
}
)
