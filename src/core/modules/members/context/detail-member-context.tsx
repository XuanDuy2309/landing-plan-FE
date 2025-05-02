import { observer } from "mobx-react";
import React from "react";
import { createContext } from "react";

export class DetailMemberContextType {

}

export const DetailMemberContext = createContext<DetailMemberContextType>(new DetailMemberContextType());

interface IProps {
    children: React.ReactNode
    id: number
}
export const DetailMemberContextProvider = observer(({ children, id }: IProps) => {
    return (
        <DetailMemberContext.Provider value={{}}>
            {children}
        </DetailMemberContext.Provider>
    )
})
export const useDetailMemberContext = () => {
    return React.useContext(DetailMemberContext)
}