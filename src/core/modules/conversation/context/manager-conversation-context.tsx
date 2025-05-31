import { observer } from "mobx-react";
import React from "react";
import { ConversationModel } from "src/core/models";

export class ManagerConversationContextType {
    selectedId: number | undefined = undefined
    setSelectedId: (id: number) => void = () => { }
    itemUpdate: ConversationModel | undefined = undefined
    setItemUpdate: (item: ConversationModel | undefined) => void = () => { }
}

export const ManagerConversationContext = React.createContext<ManagerConversationContextType>(new ManagerConversationContextType());

interface IProps {
    children: React.ReactNode;
}

export const ManagerConversationContextProvider = observer(({ children }: IProps) => {
    const [selectedId, setSelectedId] = React.useState<number>();
    const [itemUpdate, setItemUpdate] = React.useState<ConversationModel>();
    return (
        <ManagerConversationContext.Provider value={{
            selectedId,
            setSelectedId,
            itemUpdate,
            setItemUpdate
        }}>
            {children}
        </ManagerConversationContext.Provider>
    )
})

export const useManagerConversationContext = () => React.useContext(ManagerConversationContext);