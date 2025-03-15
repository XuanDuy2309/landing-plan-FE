import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { SidebarSettingLayout } from "./components/sidebar-setting-layout";

export const SettingsLayout = observer(() => {
    return (
        <div className="w-full h-full flex items-center ">
            <div className="w-[360px] h-full flex flex-col bg-white flex-none">
                <SidebarSettingLayout />
            </div>

            <div className="w-full h-full flex flex-col overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
})