import { observer } from "mobx-react"
import { ManagerMemberContextProvider } from "src/core/modules"
import { ListUserContainer } from "./list-user-container"

export const SidebarMembeContainer = observer(() => {
    return (
        <ManagerMemberContextProvider>
            <SidebarMember />
        </ManagerMemberContextProvider>
    )
})

const SidebarMember = observer(() => {
    return (
        <div className="w-[360px] h-full flex flex-col bg-white shadow border-r border-gray-300">
            <ListUserContainer />
            <ListUserContainer />
            <ListUserContainer />
        </div>
    )
})