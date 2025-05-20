import { observer } from "mobx-react"
import { Type_List } from "src/core/modules"
import { ListUserContainer } from "./list-user-container"

export const SidebarMembeContainer = observer(() => {
    return (
        <div className="w-[360px] h-full flex flex-col bg-white shadow border-r border-gray-300 flex-none overflow-y-auto">
            <ListUserContainer key={Type_List.User} type={Type_List.User} title="Danh sách người dùng" />
            <ListUserContainer key={Type_List.Follower} type={Type_List.Follower} title="Danh sách người theo dõi" />
            <ListUserContainer key={Type_List.Following} type={Type_List.Following} title="Danh sách người đang theo dõi" />
        </div>
    )
})