import dayjs from "dayjs"
import { observer } from "mobx-react"
import moment from "moment"
import { Colors } from "src/assets"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId } from "src/core/base"
import { useSocketEvent } from "src/core/hook"
import { ConversationModel, MessageModel, Type_Conversation } from "src/core/models"
import { useDetailConversationContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"

export const HeaderDetailContainer = observer(() => {
    const { data, showDetail, setShowDetail } = useDetailConversationContext()
    const { sessionStore } = useCoreStores()

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
            <div className="size-10 flex-none rounded-full overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                    >
                        <span className="text-lg font-bold text-white">{displayChar}</span>
                    </div>
                )}
            </div>
        );
    };

    useSocketEvent('new_message', (dataMess: any) => {
        data.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    })

    useSocketEvent('message_edited', (mess: MessageModel) => {
        data.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    })

    useSocketEvent('message_deleted', (mess) => {
        data.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    })

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-md border-b border-gray-200">
            <div className="w-full h-14 flex items-center px-3  space-x-4">
                {
                    renderAvatar(data)
                }
                <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-700">
                        {data.type === Type_Conversation.Direct ? data.members.find(m => m.id !== sessionStore.profile?.id)?.fullname : data.name}
                    </span>
                    {data.updated_at && <span className="text-xs text-gray-500">{data.updated_at ? dayjs(data.updated_at).fromNow() : ''}</span>}
                </div>

            </div>
            {!showDetail && <ButtonIcon icon={'more-2'} iconSize="24" color={Colors.gray[500]} onClick={() => {
                setShowDetail(!showDetail)
            }} className="mr-4" />}
        </div>
    )
})
