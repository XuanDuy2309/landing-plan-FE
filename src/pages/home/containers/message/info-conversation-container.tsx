import { observer } from "mobx-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Colors } from "src/assets"
import { InputEditing, ModalBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId, handleUpload, Type_Upload } from "src/core/base"
import { ConversationModel, Type_Conversation } from "src/core/models"
import { Type_List, useDetailConversationContext, useManagerConversationContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { ListMemberConversationContainer } from "./list-member-conversation"
import { ModalCreateConversation } from "./modal-create-conversation-container"

export const InfoConversationContainer = observer(() => {
    const { data, setShowDetail, isMute, onUpdateConversation } = useDetailConversationContext()
    const { itemUpdate, setItemUpdate } = useManagerConversationContext()
    const { sessionStore } = useCoreStores()
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const navigate = useNavigate();
    const modalRef = useRef<any>(null);


    const renderAvatar = (item: ConversationModel) => {
        if (!item.id) return null;

        const isDirect = item.type === Type_Conversation.Direct;
        const targetMember = isDirect
            ? item.members.find(m => m.id !== sessionStore.profile?.id)
            : undefined;

        const avatarUrl = isDirect
            ? targetMember?.avatar
            : item.avatar;

        const displayChar = isDirect
            ? (targetMember?.fullname?.charAt(0).toUpperCase() || '?')
            : (item.name?.charAt(0).toUpperCase() || '?');

        const bgColor = getColorFromId(
            isDirect ? targetMember?.id || 0 : item.id || 0
        );
        return (
            <div className="size-24 flex-none rounded-full overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                    >
                        <span className="text-3xl font-bold text-white">{displayChar}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-white px-3 space-y-2 border-l overflow-hidden border-gray-200">
            <div className="w-full h-14 flex items-center flex-none justify-between px-1.5">
                <ButtonIcon icon="arrowleft" iconSize="24" color={Colors.gray[500]} onClick={() => { setShowDetail(false) }} />
                {isEdit && <ButtonIcon icon="save-outline" iconSize="24" color={Colors.blue[500]} onClick={async () => {
                    await onUpdateConversation()
                    setIsEdit(false)
                }} />}
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
                <div className="size-24 flex items-center justify-center relative">
                    {
                        renderAvatar(data)
                    }
                    {data.type === Type_Conversation.Group && <ButtonIcon icon={'edit-outline'} size="xxs" color={Colors.gray[900]} className="absolute bottom-0 right-0 bg-blue-200" onClick={async () => {
                        const res = await handleUpload(Type_Upload.Image)
                        data.avatar = res[0]
                        setIsEdit(true)
                    }} />}
                </div>
                {data.type === Type_Conversation.Group && <InputEditing value={data.name}
                    onChange={(e) => {
                        data.name = e
                        setIsEdit(true)
                    }}
                    className="text-xl font-medium text-gray-700 line-clamp-1"
                    placeholder="Nhập tên nhóm"
                />}

                {data.type === Type_Conversation.Direct &&
                    <span className="text-lg font-medium text-gray-700 line-clamp-1">{data.members.find(m => m.id !== sessionStore.profile?.id)?.fullname}</span>
                }

            </div>
            <div className="w-full flex h-10 items-center justify-center space-x-4">
                {data.type === Type_Conversation.Group && <ButtonIcon icon="handover-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                    modalRef.current?.open()
                    setItemUpdate(data)
                }} />}
                {data.type === Type_Conversation.Direct && <ButtonIcon icon="profile-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                    navigate(`/home/profile/${data.members.find(m => m.id !== sessionStore.profile?.id)?.id}`)
                }} />}
                {data.type === Type_Conversation.Group && <ButtonIcon icon="logout-outline" iconSize="24" color={Colors.gray[500]} onClick={() => { }} />}
                <ButtonIcon icon={isMute ? 'offnotification-outline' : 'notification-outline'} iconSize="24" color={Colors.gray[500]} onClick={() => { }} />
            </div>
            <ListMemberConversationContainer id={data.id} key={data.id} type={Type_List.Member} title={data.type === Type_Conversation.Direct ? "Biệt danh" : "Danh sách thành viên"} />
            <ModalBase ref={modalRef}>
                <ModalCreateConversation
                    onSave={() => {
                        modalRef.current?.close()
                    }} onClose={() => {
                        modalRef.current?.close()
                    }} />
            </ModalBase>
        </div>
    )
})