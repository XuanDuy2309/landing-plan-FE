import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ConversationsApi } from "src/core/api";
import { ConversationModel } from "src/core/models";

export class DetailConversationContextType {
    data: ConversationModel = new ConversationModel()
    fecthData!: () => void
    showDetail: boolean = false
    setShowDetail: (showDetail: boolean) => void = (showDetail: boolean) => { }
    isMute: boolean = false
    setIsMute: (isMute: boolean) => void = (isMute: boolean) => { }
    onUpdateConversation!: () => void
}

export const DetailConversationContext = React.createContext<DetailConversationContextType>(new DetailConversationContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const DetailConversationContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<ConversationModel>(new ConversationModel())
    const [isMute, setIsMute] = React.useState<boolean>(false);
    const [showDetail, setShowDetail] = React.useState<boolean>(false);

    const fecthData = async () => {
        if (!id) return
        const res = await ConversationsApi.getDetailConversation(id)
        if (res.Status) {
            Object.assign(data, res.Data.data)
        }
    }

    const onUpdateConversation = async () => {
        const params: Record<string, string> = {};

        if (data.avatar) params.avatar = data.avatar;
        if (data.name) params.name = data.name;

        if (Object.keys(params).length === 0) return; // Không có gì để cập nhật

        const res = await ConversationsApi.updateConversation(data.id || 0, params);
        if (res.Status) {
            fecthData();
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
            setShowDetail,
            isMute,
            setIsMute,
            onUpdateConversation
        }}>
            {children}
        </DetailConversationContext.Provider>
    )
})

export const useDetailConversationContext = () => React.useContext(DetailConversationContext);