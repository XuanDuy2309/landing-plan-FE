import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { HeaderAdminLayout } from "./components/header-admin-layout";
import { SidebarAdminLayout } from "./components/sidebar-admin-layout";

export const AdminLayout = observer(() => {
    return (
        <div className="w-full h-full flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-[280px] h-full flex-none bg-white shadow-md">
                <SidebarAdminLayout />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full flex flex-col">
                {/* Header */}
                <div className="h-16 flex-none bg-white shadow-sm">
                    <HeaderAdminLayout />
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
})