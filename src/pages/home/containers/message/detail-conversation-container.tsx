import classNames from "classnames";
import { observer } from "mobx-react";
import { useJoinToConversationRoom } from "src/core/hook";
import { DetailConversationContextProvider, useDetailConversationContext, useManagerConversationContext } from "src/core/modules";
import { InfoConversationContainer } from "./info-conversation-container";
import { ListMessageContainer } from "./list-message-container";

export const DetailConversationContainer = observer(() => {
    const { selectedId } = useManagerConversationContext()
    
    // Always call hook at the top level
    useJoinToConversationRoom(selectedId || '')

    if (!selectedId) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <span>Vui lòng chọn cuộc hội thoại để bắt đầu trò chuyện</span>
            </div>
        )
    }

    return (
        <DetailConversationContextProvider id={selectedId}>
            <DetailConversation />
        </DetailConversationContextProvider>
    )
})

const DetailConversation = observer(() => {
    const { showDetail } = useDetailConversationContext()
    return (
        <div className="w-full h-full flex bg-gray-200">
            <div className={classNames("h-full flex items-center overflow-x-hidden transition-[width] duration-300",
                { 'w-full': !showDetail },
                { 'w-2/3': showDetail },
            )}>
                <ListMessageContainer />
            </div>
            <div className={classNames(" h-full flex flex-col transition-[width]  duration-300",
                { 'w-1/3': showDetail },
                { 'w-0': !showDetail },
            )}>
                <InfoConversationContainer />
            </div>
        </div>
    )
}
)