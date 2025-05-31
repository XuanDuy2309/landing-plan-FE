import { observer } from "mobx-react";
import React from "react";

export const enum Type_List {
    User = 1,
    Follower = 2,
    Following = 3,
    Member = 4
}

export class ManagerMemberContextType {
    selectedList: Type_List = Type_List.User
    setSelecttedList: (type: Type_List) => void = () => { }
    selectedId?: number
    setSelectedId: (id: number) => void = () => { }
}

export const ManagerMemberContext = React.createContext<ManagerMemberContextType>(new ManagerMemberContextType());

interface IProps {
    children: React.ReactNode
}


export const ManagerMemberContextProvider = observer(({ children }: IProps) => {
    const [selectedList, setSelecttedList] = React.useState<Type_List>(Type_List.User);
    const [selectedId, setSelectedId] = React.useState<number>();

    return (
        <ManagerMemberContext.Provider value={{
            selectedList,
            setSelecttedList,
            selectedId,
            setSelectedId
        }}>
            {children}
        </ManagerMemberContext.Provider>
    )
})

export const useManagerMemberContext = () => {
    return React.useContext(ManagerMemberContext)
}