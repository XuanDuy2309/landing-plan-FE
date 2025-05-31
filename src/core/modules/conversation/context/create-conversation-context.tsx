import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ConversationsApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { ConversationModel, Type_Conversation, UserModel } from "src/core/models";
import { useManagerConversationContext } from "./manager-conversation-context";

export class CreateConversationContextType {
    data: ConversationModel = new ConversationModel()
    onSubmit!: () => Promise<BaseResponse>
    onClear: () => void = () => { }
    listMember: UserModel[] = []
    setListMember: (listMember: UserModel[]) => void = (listMember: UserModel[]) => { }
    onAddNewMember!: () => Promise<BaseResponse>
}

export const CreateConversationContext = React.createContext<CreateConversationContextType>(new CreateConversationContextType());

interface IProps {
    children: React.ReactNode;
}

export const CreateConversationContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<ConversationModel>(new ConversationModel())
    const [listMember, setListMember] = React.useState<UserModel[]>([])
    const { itemUpdate, setItemUpdate, selectedId } = useManagerConversationContext()

    const onSubmit = async (): Promise<BaseResponse> => {
        if (data.members.length === 0) {
            onClear()
            return {
                Data: null,
                Code: 400,
                Status: false,
                Message: "Vui lòng chọn ít nhất một người"
            }
        }
        const params = {
            "name": data.members.length > 1 ? data.members.map(i => i.fullname).join(", ") : '',
            "type": data.members.length > 1 ? Type_Conversation.Group : Type_Conversation.Direct, // group, direct
            "members": data.members.map(i => i.id)
        }
        const res = await ConversationsApi.addConversation(params)
        return res
    }

    const onAddNewMember = async () => {
        const params = {
            "memberIds": data.members.map(i => i.id),
        }
        const res = await ConversationsApi.addMember(selectedId || 0, params)
        return res
    }

    const onClear = () => {
        Object.assign(data, new ConversationModel())
        setListMember([]);
        setItemUpdate(undefined);
    }

    const initData = (itemUpdate: ConversationModel) => {
        Object.assign(data, itemUpdate);
        data.members = itemUpdate.members.map(i => {
            const newItem = new UserModel();
            Object.assign(newItem, i);
            return newItem;
        }) || [];
        setListMember(itemUpdate.members.map(i => {
            const newItem = new UserModel();
            Object.assign(newItem, i);
            return newItem;
        }) || []);
    }

    useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate);
        }
    }, [itemUpdate])

    return (
        <CreateConversationContext.Provider value={{
            data,
            onSubmit,
            onClear,
            listMember,
            setListMember,
            onAddNewMember
        }}>
            {children}
        </CreateConversationContext.Provider>
    )
})

export const useCreateConversationContext = () => React.useContext(CreateConversationContext);