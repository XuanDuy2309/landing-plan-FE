import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "src/layouts/admins/admin-layout";
import { AuctionsScreen } from "./screens/auctions-screen";
import { DashboardScreen } from "./screens/dashboard-screen";
import { MapsScreen } from "./screens/maps-screen";
import { PostsScreen } from "./screens/posts-screen";
import { UsersScreen } from "./screens/users-screen";

// Import các screen của admin

export const AdminRoutes = () => {
    const navigator = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname.split('/').length === 2)
            navigator('/admin/dashboard');
    }, [location])
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardScreen />} />
                <Route path="users" element={<UsersScreen />} />
                <Route path="posts" element={<PostsScreen />} />
                <Route path="auctions" element={<AuctionsScreen />} />
                <Route path="maps" element={<MapsScreen />} />
            </Route>
        </Routes>
    );
};
