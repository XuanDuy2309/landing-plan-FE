import { observer } from "mobx-react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Colors } from "src/assets"
import { InputEditing, ModalBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { ModalConfirm } from "src/components/modal-confirm/modal-confim"
import { getColorFromId, handleUpload, Type_Upload } from "src/core/base"
import { ConversationModel, Role, Type_Conversation } from "src/core/models"
import { Type_List, useDetailConversationContext, useManagerConversationContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { ListMemberConversationContainer } from "./list-member-conversation"
import { ModalCreateConversation } from "./modal-create-conversation-container"
import { ModalSettingConversation } from "./modal-setting-conversation"

const ConversationAvatar = ({ conversation, onEditAvatar }: {
    conversation: ConversationModel,
    onEditAvatar?: (file: string) => void
}) => {
    const { sessionStore } = useCoreStores()

    if (!conversation.id) return null;

    const isDirect = conversation.type === Type_Conversation.Direct;
    const targetMember = isDirect
        ? conversation.members.find(m => m.id !== sessionStore.profile?.id)
        : undefined;

    const avatarUrl = isDirect ? targetMember?.avatar : conversation.avatar;
    const displayChar = isDirect
        ? (targetMember?.fullname?.charAt(0).toUpperCase() || '?')
        : (conversation.name?.charAt(0).toUpperCase() || '?');

    return (
        <div className="size-24 flex items-center justify-center relative">
            <div className="size-24 flex-none rounded-full overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: getColorFromId(isDirect ? targetMember?.id || 0 : conversation.id || 0) }}
                    >
                        <span className="text-3xl font-bold text-white">{displayChar}</span>
                    </div>
                )}
            </div>
            {conversation.type === Type_Conversation.Group && onEditAvatar && (
                <ButtonIcon
                    icon="edit-outline"
                    size="xxs"
                    color={Colors.gray[900]}
                    className="absolute bottom-0 right-0 bg-blue-200"
                    onClick={async () => {
                        const res = await handleUpload(Type_Upload.Image)
                        onEditAvatar(res[0])
                    }}
                />
            )}
        </div>
    )
}

export const InfoConversationContainer = observer(() => {
    const {
        data,
        setShowDetail,
        isMute,
        onUpdateConversation,
        onDeleteMember,
        onDeleteConversation,
        isAdmin,
        onSettingMute,
        fecthData,
        setIsMute,
        setIsAdmin
    } = useDetailConversationContext()
    const { itemUpdate, setItemUpdate, selectedId, setSelectedId } = useManagerConversationContext()
    const { sessionStore } = useCoreStores()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const navigate = useNavigate()

    const modalAddMemberRef = useRef<any>(null)
    const modalMuteRef = useRef<any>(null)
    const modalDeleteRef = useRef<any>(null)
    const modalLeaveRef = useRef<any>(null)

    const handleAvatarEdit = (newAvatar: string) => {
        data.avatar = newAvatar
        setIsEdit(true)
    }

    const handleNameEdit = (newName?: string) => {
        if (newName) {
            data.name = newName
            setIsEdit(true)
        }
    }

    const handleSaveChanges = async () => {
        await onUpdateConversation()
        setIsEdit(false)
    }

    const handleNavigateToProfile = () => {
        const targetMemberId = data.members.find(m => m.id !== sessionStore.profile?.id)?.id
        if (targetMemberId) {
            navigate(`/home/profile/${targetMemberId}`)
        }
    }

    const handleMuteSettingsChange = async (duration: number) => {
        modalMuteRef.current?.close()
        const res = await onSettingMute(duration)
        if (res.Status) {
            toast.success(res.Message)
            setIsMute(duration > 0)
            fecthData()
            return
        }
        toast.error(res.Message)
        return
    }

    const handleDeleteConversation = async () => {
        modalDeleteRef.current?.close()
        const res = await onDeleteConversation()
        if (res.Status) {
            setSelectedId(undefined)
        }
    }

    const handleLeaveConversation = async () => {
        modalLeaveRef.current?.close()
        const res = await onDeleteMember(sessionStore.profile)
        if (res.Status) {
            setSelectedId(undefined)
        }
    }

    const checkIsMute = (date?: string) => {
        if (!date) return false
        const muteUntil = moment(date)
        return muteUntil.isValid() ? moment().isBefore(muteUntil) : false
    }

    const updateMemberStatus = (profileId: number | undefined) => {
        if (!data.members.length || !profileId) return;

        const currentMember = data.members.find(member => member.id === profileId);
        if (!currentMember) return;

        console.log("Current member:", currentMember.muted_until);
        // Update mute status
        setIsMute(checkIsMute(currentMember.muted_until));

        // Update admin status
        setIsAdmin(currentMember.role === Role.admin);
    }

    useEffect(() => {
        updateMemberStatus(sessionStore.profile?.id);
    }, [data.members, sessionStore.profile?.id, data.id]);

    return (
        <div className="w-full h-full flex flex-col bg-white px-3 space-y-2 border-l overflow-hidden border-gray-200">
            <div className="w-full h-14 flex items-center flex-none justify-between px-1.5">
                <ButtonIcon
                    icon="arrowleft"
                    iconSize="24"
                    color={Colors.gray[500]}
                    onClick={() => setShowDetail(false)}
                />
                {isEdit && (
                    <ButtonIcon
                        icon="save-outline"
                        iconSize="24"
                        color={Colors.blue[500]}
                        onClick={handleSaveChanges}
                    />
                )}
            </div>

            <div className="w-full flex flex-col items-center space-y-4">
                <ConversationAvatar
                    conversation={data}
                    onEditAvatar={data.type === Type_Conversation.Group ? handleAvatarEdit : undefined}
                />

                {data.type === Type_Conversation.Group ? (
                    <InputEditing
                        value={data.name}
                        onChange={handleNameEdit}
                        className="text-xl font-medium text-gray-700 line-clamp-1"
                        placeholder="Nhập tên nhóm"
                    />
                ) : (
                    <span className="text-lg font-medium text-gray-700 line-clamp-1">
                        {data.members.find(m => m.id !== sessionStore.profile?.id)?.fullname}
                    </span>
                )}
            </div>

            <div className="w-full flex h-10 items-center justify-center space-x-4">
                {data.type === Type_Conversation.Group ? (
                    <ButtonIcon
                        icon="handover-outline"
                        iconSize="24"
                        color={Colors.gray[500]}
                        onClick={() => {
                            modalAddMemberRef.current?.open()
                            setItemUpdate(data)
                        }}
                    />
                ) : (
                    <ButtonIcon
                        icon="profile-outline"
                        iconSize="24"
                        color={Colors.gray[500]}
                        onClick={handleNavigateToProfile}
                    />
                )}

                <ButtonIcon
                    icon={isMute ? 'offnotification-outline' : 'notification-outline'}
                    iconSize="24"
                    color={Colors.gray[500]}
                    onClick={async () => {
                        modalMuteRef.current?.open()
                    }}
                />

                {((isAdmin && data.type === Type_Conversation.Group) || data.type === Type_Conversation.Direct) && (
                    <ButtonIcon
                        icon="delete-outline"
                        iconSize="24"
                        color={Colors.red[300]}
                        onClick={() => modalDeleteRef.current?.open()}
                    />
                )}

                {data.type === Type_Conversation.Group && (
                    <ButtonIcon
                        icon="logout-outline"
                        iconSize="24"
                        color={Colors.red[300]}
                        onClick={() => modalLeaveRef.current?.open()}
                    />
                )}
            </div>

            <ListMemberConversationContainer
                id={data.id}
                key={data.id}
                type={Type_List.Member}
                title={data.type === Type_Conversation.Direct ? "Biệt danh" : "Danh sách thành viên"}
            />

            <ModalBase ref={modalAddMemberRef} destroyOnClose>
                <ModalCreateConversation
                    onSave={() => modalAddMemberRef.current?.close()}
                    onClose={() => modalAddMemberRef.current?.close()}
                />
            </ModalBase>

            <ModalBase ref={modalMuteRef} destroyOnClose>
                <ModalSettingConversation
                    onSave={handleMuteSettingsChange}
                    onClose={() => modalMuteRef.current?.close()}
                />
            </ModalBase>

            <ModalConfirm
                ref={modalDeleteRef}
                label="Bạn có chắc muốn xóa cuộc trò chuyện này?"
                onCancel={() => modalDeleteRef.current?.close()}
                onConfirm={handleDeleteConversation}
            />

            <ModalConfirm
                ref={modalLeaveRef}
                label="Bạn có chắc muốn rời cuộc trò chuyện này?"
                onCancel={() => modalLeaveRef.current?.close()}
                onConfirm={handleLeaveConversation}
            />
        </div>
    )
})