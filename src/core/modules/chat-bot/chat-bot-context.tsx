import { observer } from "mobx-react";
import React, { useState } from "react";
import { ChatbotApi } from "src/core/api";
import { ChatBotModel } from "src/core/models/chat-bot-model";

export class IFilterChatbotContextType {
    constructor() {
    }
}

export class ListChatbotContextType {
    data: ChatBotModel[] = []
    message: ChatBotModel = new ChatBotModel()
    handleSendMessage = async (message: ChatBotModel): Promise<any> => { }
    loading: boolean = false
    isOpenDropdown: boolean = false
    setOpenDropdown: (isOpenDropdown: boolean) => void = (isOpenDropdown: boolean) => { }
}

export const ListChatbotContext = React.createContext<ListChatbotContextType>(new ListChatbotContextType());

interface IProps {
    children: React.ReactNode;
}

export const ListChatbotContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = useState<ChatBotModel[]>([])
    const [message, setMessage] = useState<ChatBotModel>(new ChatBotModel())
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenDropdown, setOpenDropdown] = useState<boolean>(false)
    const handleSendMessage = async (message: ChatBotModel) => {
        const params = {
            "message": message.message
        }
        setLoading(true)
        const res = await ChatbotApi.sendMessage(params)
        setLoading(false)
        if (res.Status) {
            const temp = new ChatBotModel()
            temp.message = res.Data.data.message
            temp.isMine = false
            data.push(temp)
            return res
        }
        const temp = new ChatBotModel()
        temp.isError = true
        temp.isMine = false
        temp.message = res.Message
        data.push(temp)
        return res
    }


    return (
        <ListChatbotContext.Provider value={{ data, message, handleSendMessage, loading, isOpenDropdown, setOpenDropdown }}>
            {children}
        </ListChatbotContext.Provider>
    )
})

export const useListChatbotContext = () => React.useContext(ListChatbotContext);
