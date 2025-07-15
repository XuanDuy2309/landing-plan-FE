import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { getColorFromId } from "src/core/base";
import { useCoreStores } from "src/core/stores";

export const SidebarAdminLayout = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sessionStore } = useCoreStores();

    const menuItems = [
        {
            icon: "home-outline",
            label: "Dashboard",
            path: "/admin/dashboard"
        },
        {
            icon: "user-outline",
            label: "Quản lý người dùng",
            path: "/admin/users"
        },
        {
            icon: "notification-outline",
            label: "Quản lý bài đăng",
            path: "/admin/posts"
        },
        {
            icon: "settings-outline",
            label: "Quản lý đấu giá",
            path: "/admin/auctions"
        },
        {
            icon: "map-outline",
            label: "Quản lý bản đồ",
            path: "/admin/maps"
        }
    ];

    return (
        <div className="w-full h-full flex flex-col">
            {/* Logo & Brand */}
            <div className="px-3 border-b border-gray-100 h-16 py-1 flex items-center justify-start space-x-2 cursor-pointer"
                onClick={() => { navigate('/home') }}
            >
                <img src="/images/logo-landing-plan.png" alt="" className="h-full object-contain bg-blue-300 rounded" />
                <span className="text-lg font-medium text-green-900">LANDING PLAN</span>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`w-full h-12 flex items-center px-4 cursor-pointer hover:bg-blue-50 ${location.pathname.startsWith(item.path) ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                            }`}
                        onClick={() => navigate(item.path)}
                    >
                        <IconBase icon={item.icon} size={20} color={Colors.gray[900]} />
                        <span className="ml-3 text-gray-900 text-lg font-medium">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* User Profile */}
            <div className="h-20 border-t border-gray-200 flex items-center px-4">
                <div className='size-10 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'
                    style={{
                        backgroundColor: getColorFromId(sessionStore.profile?.id || 0)
                    }}
                >
                    {
                        sessionStore.profile && sessionStore.profile?.avatar ?
                            <img src={sessionStore.profile.avatar} alt="" className="size-full object-cover" />
                            :
                            <span className="text-2xl font-bold text-white">{sessionStore.profile?.fullname?.charAt(0).toUpperCase()}</span>

                    }
                </div>
                <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{sessionStore.profile?.fullname}</div>
                    <div className="text-xs text-gray-500">Quản trị viên</div>
                </div>
            </div>
        </div >
    );
});
