import { observer } from "mobx-react";
import { ManagerConversationContextProvider } from "src/core/modules";
import { DetailConversationContainer } from "../containers/message/detail-conversation-container";
import { ListConversationContainer } from "../containers/message/list-conversation-container";

export const MessageScreen = observer(() => {
    return (
        <ManagerConversationContextProvider>
            <div className="w-full h-full flex">
                <ListConversationContainer />
                <DetailConversationContainer />
            </div>
        </ManagerConversationContextProvider>
    )
});