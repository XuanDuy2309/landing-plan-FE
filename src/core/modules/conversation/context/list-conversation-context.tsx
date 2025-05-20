import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "src/core/context";
import { ConversationModel } from "src/core/models";
import { ConversationUseCase } from "../usecase";

export class IFilterConversationContextType extends IContextFilter {
    constructor() {
        super();
    }
}

export class ListConversationContextType extends IBaseContextType<ConversationModel, IFilterConversationContextType> {
}

export const ListConversationContext = React.createContext<ListConversationContextType>(new ListConversationContextType());

interface IProps {
    children: React.ReactNode;
}

export const ListConversationContextProvider = observer(({ children }: IProps) => {
    const context = useBaseContextProvider<IFilterConversationContextType, ConversationModel>(new IFilterConversationContextType(), request)

    async function request(
        filter: IFilterConversationContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: ConversationModel[]; offset: number }> {
        const uc = new ConversationUseCase()
        const res = await uc.fetchInternal({ ...filter }, index, pageSize)
        return {
            ...res,
        }
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <ListConversationContext.Provider value={{ ...context }}>
            {children}
        </ListConversationContext.Provider>
    )
})

export const useListConversationContext = () => React.useContext(ListConversationContext);