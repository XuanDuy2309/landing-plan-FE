import classNames from 'classnames'
import { observer } from 'mobx-react'

interface IProps {
    content?: string
    isBot: boolean
}

export const ItemMessageChatBot = observer(({ content, isBot }: IProps) => {
    return (
        <div
         className={classNames(
            "flex items-start space-x-3 mb-4 transition-all duration-200 ease-in-out w-full h-fit",
            {
                'justify-end': !isBot, // Tin nhắn user nằm bên phải
                'justify-start': isBot  // Tin nhắn bot nằm bên trái
            }
        )}>
            <div className={classNames(
                "flex flex-col max-w-[80%] md:max-w-[80%]",
                {
                    'items-end': !isBot, // User: căn phải
                    'items-start': isBot // Bot: căn trái
                }
            )}>
                <div
                    className={classNames(
                        "px-4 py-3 rounded-2xl break-words shadow-sm",
                        {
                            // Tin nhắn của user (bên phải)
                            'bg-blue-500 text-white rounded-br-md': !isBot,
                            // Tin nhắn của bot (bên trái)
                            'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md': isBot
                        }
                    )}
                >
                    <span className="whitespace-pre-line text-sm leading-relaxed">
                        {content}
                    </span>
                </div>

                {/* Có thể thêm timestamp ở đây nếu cần */}
                {/* <span className="text-xs text-gray-500 mt-1 px-2">
                    {new Date().toLocaleTimeString()}
                </span> */}
            </div>
        </div>
    )
})
