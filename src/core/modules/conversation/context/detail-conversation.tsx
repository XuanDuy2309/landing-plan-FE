import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ConversationsApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { ConversationModel, Role, UserModel } from "src/core/models";

export class DetailConversationContextType {
    data: ConversationModel = new ConversationModel()
    fecthData!: () => void
    showDetail: boolean = false
    setShowDetail: (showDetail: boolean) => void = (showDetail: boolean) => { }
    isMute: boolean = false
    setIsMute: (isMute: boolean) => void = (isMute: boolean) => { }
    onUpdateConversation!: () => void
    isAdmin: boolean = false
    setIsAdmin: (isAdmin: boolean) => void = (isAdmin: boolean) => { }
    onUpdateNickname!: (item: UserModel) => Promise<BaseResponse>
    onUpdateRole!: (item: UserModel) => Promise<BaseResponse>
    onDeleteMember!: (item?: UserModel) => Promise<BaseResponse>
    onDeleteConversation!: () => Promise<BaseResponse>
    onSettingMute!: (duration: number) => Promise<BaseResponse>
}

export const DetailConversationContext = React.createContext<DetailConversationContextType>(new DetailConversationContextType());

interface IProps {
    children: React.ReactNode;
    id?: number
}

export const DetailConversationContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<ConversationModel>(new ConversationModel())
    const [isMute, setIsMute] = React.useState<boolean>(false);
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
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

    const onDeleteConversation = async () => {
        if (!id) return {
            Data: null,
            Status: false,
            Message: "Invalid conversation ID",
            Code: 400
        };
        const res = await ConversationsApi.deleteConversation(id);
        return res;
    }

    const onUpdateNickname = async (item: UserModel): Promise<BaseResponse> => {
        if (!id || !item) {
            return {
                Data: null,
                Status: false,
                Message: "Invalid conversation or user",
                Code: 400
            };
        }
        const params = {
            nickname: item.nickname || ""
        }
        const res = await ConversationsApi.updateNickName(id, item.id || 0, params);
        return res;
    }

    const onUpdateRole = async (item: UserModel) => {
        if (!id || !item) {
            return {
                Data: null,
                Status: false,
                Message: "Invalid conversation or user",
                Code: 400
            };
        }
        const params = {
            role: Role.admin
        }
        const res = await ConversationsApi.updateRoleMember(id, item.id || 0, params);
        return res;
    }

    const onDeleteMember = async (item?: UserModel) => {
        if (!id || !item) {
            return {
                Data: null,
                Status: false,
                Message: "Invalid conversation or user",
                Code: 400
            };
        }
        const res = await ConversationsApi.removeMember(id, item.id || 0);
        return res;
    }

    const onSettingMute = async (duration: number) => {
        if (!id) {
            return {
                Data: null,
                Status: false,
                Message: "Invalid conversation or user",
                Code: 400
            };
        }
        const params = {
            muteDuration: duration
        };
        const res = await ConversationsApi.updateMuteMember(id, params);

        return res;
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
            onUpdateConversation,
            isAdmin,
            setIsAdmin,
            onUpdateNickname,
            onUpdateRole,
            onDeleteMember,
            onDeleteConversation,
            onSettingMute
        }}>
            {children}
        </DetailConversationContext.Provider>
    )
})

export const useDetailConversationContext = () => React.useContext(DetailConversationContext);