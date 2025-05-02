import { observer } from "mobx-react";
import { SidebarMembeContainer } from "../containers/member/sidebar-member";

export const MemberScreen = observer(()=>{
    return (
        <div className="w-full h-full flex space-x-3">
            <SidebarMembeContainer/>
        </div>
    )
})