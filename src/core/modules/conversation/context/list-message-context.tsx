import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "src/core/context";
import { MessageModel } from "src/core/models";
import { ConversationUseCase } from "../usecase";

export class IFilterMessageContextType extends IContextFilter {
    constructor() {
        super();
    }
}

export class ListMessageContextType extends IBaseContextType<MessageModel, IFilterMessageContextType> {
}

export const ListMessageContext = React.createContext<ListMessageContextType>(new ListMessageContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const ListMessageContextProvider = observer(({ children, id }: IProps) => {
    const context = useBaseContextProvider<IFilterMessageContextType, MessageModel>(new IFilterMessageContextType(), request)

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

    useEffect(() => {
        context.onRefresh()
    }, [id])

    return (
        <ListMessageContext.Provider value={{ ...context }}>
            {children}
        </ListMessageContext.Provider>
    )
})

export const useListMessageContext = () => React.useContext(ListMessageContext);