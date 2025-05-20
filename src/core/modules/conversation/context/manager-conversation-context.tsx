import { observer } from "mobx-react";
import React from "react";

export class ManagerConversationContextType {
    selectedId: number | undefined = undefined
    setSelectedId: (id: number) => void = () => { }
}

export const ManagerConversationContext = React.createContext<ManagerConversationContextType>(new ManagerConversationContextType());

interface IProps {
    children: React.ReactNode;
}

export const ManagerConversationContextProvider = observer(({ children }: IProps) => {
    const [selectedId, setSelectedId] = React.useState<number>();
    return (
        <ManagerConversationContext.Provider value={{
            selectedId,
            setSelectedId
        }}>
            {children}
        </ManagerConversationContext.Provider>
    )
})

export const useManagerConversationContext = () => React.useContext(ManagerConversationContext);