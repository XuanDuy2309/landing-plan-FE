import { Spin } from "antd"
import classNames from "classnames"
import { useListChatbotContext } from "src/core/modules"
import { ItemMessageChatBot } from "../../components/chat-bot/item-message-chat-bot"

export const ListMessageChatBotContainer = () => {
    const { data, message, loading } = useListChatbotContext()
    return (
        <div className="p-3 flex flex-colll h-full overflow-y-auto bg-white min-h-0">
              <div className="flex flex-col">
                    {data && data.length > 0 && data.map((item, index) => (
                        <ItemMessageChatBot key={index} content={item.message} isBot={!item.isMine} />
                    ))}
              </div>
            {loading && (
                <div
                    className={classNames('w-full items-center justify-center flex ', {
                        'h-full': data.length === 0,
                    })}
                >
                    <Spin />
                </div>
            )}
            {!loading && data.length === 0 && (
                <div className='w-full h-full flex justify-center items-center'>
                    <span>{"Không có dữ liệu"}</span>
                </div>
            )}
        </div>
    )
}
