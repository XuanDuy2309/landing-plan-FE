import { observer } from "mobx-react";
import React from "react";
import { ConversationsApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { MessageModel } from "src/core/models";
import { useManagerConversationContext } from "./manager-conversation-context";

export class CreateMessageContextType {
    data: MessageModel = new MessageModel()
    onSubmit!: () => Promise<BaseResponse>
    onClear: () => void = () => { }
    loading: boolean = false
    setLoading: (value: boolean) => void = () => { }
}

export const CreateMessageContext = React.createContext<CreateMessageContextType>(new CreateMessageContextType());

interface IProps {
    children: React.ReactNode;
}

export const CreateMessageContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<MessageModel>(new MessageModel())
    const [loading, setLoading] = React.useState<boolean>(false);
    const { selectedId } = useManagerConversationContext()

    const onSubmit = async () => {

        if (!selectedId) {
            return {
                Data: null,
                Code: 400,
                Status: false,
                Message: ""
            }
        }
        const params = {
            "content": data.content,
            "type": data.type
        }
        setLoading(true)
        const res = await ConversationsApi.sendMessage(selectedId, params)
        setLoading(false)
        return res
    }

    const onClear = () => {
        Object.assign(data, new MessageModel())
    }

    return (
        <CreateMessageContext.Provider value={{
            data,
            onSubmit,
            onClear,
            loading,
            setLoading
        }}>
            {children}
        </CreateMessageContext.Provider>
    )
})

export const useCreateMessageContext = () => React.useContext(CreateMessageContext);