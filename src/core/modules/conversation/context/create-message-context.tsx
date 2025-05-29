import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { AuthApi, ConversationsApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { MessageModel, MessageType } from "src/core/models";
import { useListMessageContext } from "./list-message-context";
import { useManagerConversationContext } from "./manager-conversation-context";

export class CreateMessageContextType {
    data: MessageModel = new MessageModel()
    onSubmit!: () => Promise<BaseResponse>
    onClear: () => void = () => { }
    loading: boolean = false
    setLoading: (value: boolean) => void = () => { }
    onUpload!: (file: File, type: MessageType) => void
}

export const CreateMessageContext = React.createContext<CreateMessageContextType>(new CreateMessageContextType());

interface IProps {
    children: React.ReactNode;
}

export const CreateMessageContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<MessageModel>(new MessageModel())
    const { itemUpdate, setItemUpdate, setReplyMess, replyMess } = useListMessageContext()
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
            "type": data.type,
            "reply_id": replyMess?.id
        }
        setLoading(true)
        if (itemUpdate && itemUpdate.id) {
            const res = await ConversationsApi.updateMessage(selectedId, itemUpdate.id, params)
            setLoading(false)
            return res
        }
        const res = await ConversationsApi.sendMessage(selectedId, params)
        setLoading(false)
        return res
    }

    const onUpload = async (file: File, type: MessageType) => {
        const form = new FormData();
        form.append('files', file, file.name);
        form.append('type', type);
        const res = await AuthApi.upload(form);
        if (res.Status) {
            data.content = res.Data.data
            data.type = type
        }
    }

    const onClear = () => {
        Object.assign(data, new MessageModel())
        setItemUpdate(undefined)
        setReplyMess(undefined)
    }

    const initData = (itemUpdate: MessageModel) => {
        Object.assign(data, itemUpdate);
    }

    useEffect(() => {
        if (selectedId) {
            Object.assign(data, new MessageModel())
        }
    }, [selectedId])

    React.useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate)
        }
    }, [itemUpdate])

    return (
        <CreateMessageContext.Provider value={{
            data,
            onSubmit,
            onClear,
            loading,
            setLoading,
            onUpload
        }}>
            {children}
        </CreateMessageContext.Provider>
    )
})

export const useCreateMessageContext = () => React.useContext(CreateMessageContext);