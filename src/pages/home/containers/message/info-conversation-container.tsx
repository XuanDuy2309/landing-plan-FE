import { observer } from "mobx-react"
import { Colors } from "src/assets"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId } from "src/core/base"
import { Type_List, useDetailConversationContext } from "src/core/modules"
import { ListMemberConversationContainer } from "./list-member-conversation"

export const InfoConversationContainer = observer(() => {
    const { data, setShowDetail } = useDetailConversationContext()

    return (
        <div className="w-full h-full flex flex-col bg-white px-3 space-y-2 border-l overflow-hidden border-gray-200">
            <div className="w-full h-14 flex items-center flex-none justify-between px-1.5">
                <ButtonIcon icon="arrowleft" iconSize="24" color={Colors.gray[500]} onClick={() => { setShowDetail(false) }} />
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
                <div className="size-[100px] rounded-full flex items-center justify-center overflow-hidden flex-noen"
                    style={
                        {
                            backgroundColor: getColorFromId(data.id || 0)
                        }
                    }
                >
                    <span className="text-5xl font-bold text-white" >{data.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-lg font-bold text-gray-700">{data.name}</span>
            </div>
            <div className="w-full flex h-10 items-center justify-center space-x-4">
                <ButtonIcon icon="handover-outline" iconSize="24" color={Colors.gray[500]} onClick={() => { }} />
                <ButtonIcon icon="logout-outline" iconSize="24" color={Colors.gray[500]} onClick={() => { }} />
            </div>
            <ListMemberConversationContainer key={Type_List.User} type={Type_List.User} title="Danh sách thành viên" />

        </div>
    )
})