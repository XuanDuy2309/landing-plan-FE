import { observer } from "mobx-react";
import { ManagerMemberContextProvider } from "src/core/modules";
import { SidebarMembeContainer } from "../containers/member/sidebar-member";
import { ProfileDetailScreen } from "./profile-detail";

export const MemberScreen = observer(() => {
    return (
        <ManagerMemberContextProvider>
            <div className="w-full h-full flex">
                <SidebarMembeContainer />
                <ProfileDetailScreen />
            </div>
        </ManagerMemberContextProvider>
    )
})