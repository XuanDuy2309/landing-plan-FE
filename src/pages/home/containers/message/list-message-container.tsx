import { observer } from "mobx-react"
import { CreateMessageContextProvider, ListMessageContextProvider, useManagerConversationContext } from "src/core/modules"
import { useDetailConversationContext } from "src/core/modules/conversation/context/detail-conversation"
import { HeaderDetailContainer } from "../../components/message/header-detail-container"
import { InputContentMessageContainer } from "./input-content-message-container"
import { ListMessageContent } from "./list-mess-content"

export const ListMessageContainer = observer(() => {
    const { data } = useDetailConversationContext()
    const { selectedId } = useManagerConversationContext()
    return (
        <div className="relative w-full h-full flex flex-col min-h-0">
            <HeaderDetailContainer />
            <ListMessageContextProvider id={selectedId}>
                <>
                    <ListMessageContent
                    />
                    <CreateMessageContextProvider>
                        <InputContentMessageContainer />
                    </CreateMessageContextProvider>
                </>
            </ListMessageContextProvider>
        </div>
    )
}
)