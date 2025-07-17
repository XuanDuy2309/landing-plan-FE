import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { useCoreStores } from "src/core/stores";

export const HeaderAdminLayout = observer(() => {
    const navigate = useNavigate();
    const { sessionStore } = useCoreStores();
    const location = useLocation();


    const handleLogout = () => {
        sessionStore.logout();
        navigate("/auth/login");
    };

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
        <div className="w-full h-full flex items-center justify-between px-6">
            <div className="text-lg font-medium text-gray-900">
                {menuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Admin Dashboard'}
            </div>

            <div className="flex items-center space-x-4">
                <ButtonIcon
                    icon="map-outline"
                    size="xxs"
                    color={Colors.gray[700]}
                    onClick={() => {
                        navigate('/')
                    }}
                />
                <ButtonIcon
                    icon="home-outline"
                    size="xxs"
                    color={Colors.gray[700]}
                    onClick={() => {
                        navigate('/home')
                    }}
                />
                <ButtonIcon
                    icon="logout-outline"
                    size="xxs"
                    color={Colors.gray[700]}
                    onClick={handleLogout}
                />
            </div>
        </div>
    );
});
