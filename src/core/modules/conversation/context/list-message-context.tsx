import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { ConversationsApi } from "src/core/api";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "src/core/context";
import { MessageModel } from "src/core/models";
import { ConversationUseCase } from "../usecase";

export class IFilterMessageContextType extends IContextFilter {
    constructor() {
        super();
    }
}

export class ListMessageContextType extends IBaseContextType<MessageModel, IFilterMessageContextType> {
    onDeleteMessage!: (id?: number, message_id?: number) => void
    replyMess!: MessageModel | undefined
    setReplyMess!: (value: MessageModel | undefined) => void
    copyMess!: MessageModel | undefined
    setCopyMess!: (value: MessageModel | undefined) => void
}

export const ListMessageContext = React.createContext<ListMessageContextType>(new ListMessageContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const ListMessageContextProvider = observer(({ children, id }: IProps) => {
    const context = useBaseContextProvider<IFilterMessageContextType, MessageModel>(new IFilterMessageContextType(), request)
    const [replyMess, setReplyMess] = useState<MessageModel>();
    const [copyMess, setCopyMess] = useState<MessageModel>();


    async function request(
        filter: IFilterMessageContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: MessageModel[]; offset: number }> {
        const uc = new ConversationUseCase()
        const res = await uc.fetchMessage(id || 0, { ...filter }, index, pageSize)
        return {
            ...res,
        }
    }

    const onDeleteMessage = async (id?: number, message_id?: number) => {
        if (!id || !message_id) return
        await ConversationsApi.deleteMessage(id, message_id)
    }

    useEffect(() => {
        context.onRefresh()
        setReplyMess(undefined)
    }, [id])

    return (
        <ListMessageContext.Provider value={{ ...context, onDeleteMessage, replyMess, setReplyMess, copyMess, setCopyMess }}>
            {children}
        </ListMessageContext.Provider>
    )
})

export const useListMessageContext = () => React.useContext(ListMessageContext);