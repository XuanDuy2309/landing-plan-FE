import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ConversationsApi } from "src/core/api";
import { ConversationModel } from "src/core/models";

export class DetailConversationContextType {
    data: ConversationModel = new ConversationModel()
    fecthData!: () => void
    showDetail: boolean = false
    setShowDetail: (showDetail: boolean) => void = (showDetail: boolean) => { }
}

export const DetailConversationContext = React.createContext<DetailConversationContextType>(new DetailConversationContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const DetailConversationContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<ConversationModel>(new ConversationModel())
    const [showDetail, setShowDetail] = React.useState<boolean>(false);

    const fecthData = async () => {
        if (!id) return
        const res = await ConversationsApi.getDetailConversation(id)
        if (res.Status) {
            Object.assign(data, res.Data.data)
        }
    }

    useEffect(() => {
        fecthData()
    }, [id])

    return (
        <DetailConversationContext.Provider value={{
            data,
            fecthData,
            showDetail,
            setShowDetail
        }}>
            {children}
        </DetailConversationContext.Provider>
    )
})

export const useDetailConversationContext = () => React.useContext(DetailConversationContext);