import { observer } from "mobx-react";
import React from "react";
import { ConversationsApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { ConversationModel, Type_Conversation, UserModel } from "src/core/models";

export class CreateConversationContextType {
    data: ConversationModel = new ConversationModel()
    onSubmit!: () => Promise<BaseResponse>
    onClear: () => void = () => { }
    listMember: UserModel[] = []
    setListMember: (listMember: UserModel[]) => void = (listMember: UserModel[]) => { }
}

export const CreateConversationContext = React.createContext<CreateConversationContextType>(new CreateConversationContextType());

interface IProps {
    children: React.ReactNode;
}

export const CreateConversationContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<ConversationModel>(new ConversationModel())
    const [listMember, setListMember] = React.useState<UserModel[]>([])

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
            "name": listMember.map(it => it.fullname).join(", "),
            "type": data.members.length > 1 ? Type_Conversation.Group : Type_Conversation.Direct, // group, direct
            "members": data.members
        }
        const res = await ConversationsApi.addConversation(params)
        return res
    }

    const onClear = () => {
        Object.assign(data, new ConversationModel())
    }

    return (
        <CreateConversationContext.Provider value={{
            data,
            onSubmit,
            onClear,
            listMember,
            setListMember
        }}>
            {children}
        </CreateConversationContext.Provider>
    )
})

export const useCreateConversationContext = () => React.useContext(CreateConversationContext);