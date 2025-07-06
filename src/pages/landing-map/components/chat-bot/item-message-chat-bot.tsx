import classNames from 'classnames'
import { observer } from 'mobx-react'

interface IProps {
    content?: string
    isBot: boolean
}

export const ItemMessageChatBot = observer(({ content, isBot }: IProps) => {
    const formatBotMessage = (message) => {
        // Tách các phần của tin nhắn
        const parts = message.split(/(?=- [A-Z])|(?=\n\n)/);

        return parts
            .map((part, index) => {
                if (part.trim().startsWith('- ')) {
                    // Đây là thông tin sản phẩm
                    const lines = part.trim().split('\n');
                    const productName = lines[0].replace('- ', '');
                    const details = lines.slice(1).filter((line) => line.trim());

                    return (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm mb-3 border border-gray-100 border-l-blue-700 border-l-4">
                            <div className="text-lg font-semibold mb-2 text-blue-600 flex items-center gap-2">
                                🎭 {productName}
                            </div>
                            <div className="space-y-2">
                                {details.map((detail, idx) => {
                                    const [label, value] = detail.split(': ');
                                    if (!value) return null;

                                    let icon = '';
                                    if (label.includes("tiêu đề")) icon = '📝'
                                    else if (label.includes("diện tich")) icon = '📝'
                                    else if (label.includes("địa chỉ")) icon = '📝'
                                    else if (label.includes("giá")) icon = '📝'
                                    else if (label.includes("loại đất")) icon = '📝'
                                    else if (label.includes("mục đích đăng")) icon = '📝'
                                    else if (label.includes("giá thuê")) icon = '📝'
                                    else if (label.includes("giá khởi điểm")) icon = '📝'
                                    else if (label.includes("bước giá")) icon = '📝'
                                    else if (label.includes("ngày bắt đầu")) icon = '📝'
                                    else if (label.includes("ngày kết thúc")) icon = '📝'
                                    if (label.includes("link")) {
                                        icon = "🔗"
                                        return (
                                            <div key={idx} className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-md transition-colors">
                                                <span className="text-lg">{icon}</span>
                                                <span className="font-medium text-gray-700 min-w-[100px]">{"Chi tiết tại"}:</span>
                                                <span className="text-gray-600 hover:underline hover:text-blue-700 cursor-pointer"
                                                    onClick={() => {
                                                        window.open(value.trim(), '_blank');
                                                    }}
                                                >{"Tại đây"}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={idx} className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-md transition-colors">
                                            <span className="text-lg">{icon}</span>
                                            <span className="font-medium text-gray-700 min-w-[100px]">{label.trim()}:</span>
                                            <span className="text-gray-600">{value.trim()}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                } else if (part.trim().startsWith('*')) {
                    // Tin nhắn khóa
                    return (
                        <div key={index} className="text-red-700 mb-2 leading-relaxed">
                            {part.trim()}
                        </div>
                    );
                }
                else {
                    // Tin nhắn thường
                    return (
                        <div key={index} className="text-gray-700 mb-2 leading-relaxed">
                            {part.trim()}
                        </div>
                    );
                }
            })
            .filter(Boolean);
    };
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
                        {isBot ? formatBotMessage(content) : content}
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
