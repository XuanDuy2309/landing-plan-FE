import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "src/core/context";
import { MessageModel } from "src/core/models";
import { ConversationUseCase } from "../usecase";

export class IFilterMediaContextType extends IContextFilter {
    constructor() {
        super();
    }
}

export class ListMediaContextType extends IBaseContextType<MessageModel, IFilterMediaContextType> {
}

export const ListMediaContext = React.createContext<ListMediaContextType>(new ListMediaContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const ListMediaContextProvider = observer(({ children, id }: IProps) => {
    const context = useBaseContextProvider<IFilterMediaContextType, MessageModel>(new IFilterMediaContextType(), request)


    async function request(
        filter: IFilterMediaContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: MessageModel[]; offset: number }> {
        const uc = new ConversationUseCase()
        const res = await uc.fetchMedia(id || 0, { ...filter }, index, pageSize)
        return {
            ...res,
        }
    }

    useEffect(() => {
        context.onRefresh()
    }, [id])

    return (
        <ListMediaContext.Provider value={{ ...context }}>
            {children}
        </ListMediaContext.Provider>
    )
})

export const useListMediaContext = () => React.useContext(ListMediaContext);