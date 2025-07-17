import { Spin } from "antd";
import { observer } from "mobx-react";
import { JSX, useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { useNotificationStore } from "./core/context";
import { socketService } from "./core/services";
import { useCoreStores } from "./core/stores";
import { HomeLayout } from "./layouts/home/home-layout";
import { AdminRoutes } from "./pages/admin/routes";
import { AuthRoutes } from "./pages/auth/routes";
import { HomeRoutes } from "./pages/home/routes";
import { AuctionScreen } from "./pages/home/screens/auction-screen";
import { PostDetailScreen } from "./pages/home/screens/post-detail";
import { LandingMapRoutes } from "./pages/landing-map/routes";
import { SettingsRoutes } from "./pages/settings/routes";


export const AppRouter = observer(() => {
    const notificationStore = useNotificationStore();
    const { sessionStore } = useCoreStores();
    const token = sessionStore.session?.access_token;

    useEffect(() => {
        if (!token) {
            return;
        }
        socketService.connect(token);

        return () => {
            socketService.disconnect();
        };
    }, [token]);
    return (
        <div className="w-screen h-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingMapRoutes />} />
                    <Route path="admin/*" element={
                        <RequireAuth requireAdmin>
                            <AdminRoutes />
                        </RequireAuth>
                    } />


                    <Route path="auth/*" element={
                        <SkipAuth>
                            <AuthRoutes />
                        </SkipAuth>} />
                    <Route path="/*" element={<HomeLayout />}>
                        <Route path="home/*" element={
                            <RequireAuth>
                                <HomeRoutes />
                            </RequireAuth>
                        } />
                        <Route path="settings/*" element={
                            <RequireAuth>
                                <SettingsRoutes />
                            </RequireAuth>
                        } />
                    </Route>
                    <Route path="post/:id" element={
                        <RequireAuth>
                            <PostDetailScreen />
                        </RequireAuth>
                    } />
                    <Route path="auction/:id" element={
                        <RequireAuth>
                            <AuctionScreen />
                        </RequireAuth>
                    } />
                    {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
                </Routes>
            </Router>
        </div>
    );

})

const SkipAuth = observer(({ children }: { children: JSX.Element }) => {
    const { sessionStore } = useCoreStores();
    const location = useLocation();

    if (!sessionStore.isInitialized) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    // Nếu đã đăng nhập, kiểm tra role và điều hướng
    if (sessionStore.session?.access_token) {
        // Kiểm tra nếu user có role admin
        if (sessionStore.profile?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        // Nếu không phải admin thì điều hướng về route trước đó hoặc /home
        const from = location.state?.from || '/home';
        return <Navigate to={from} replace />;
    }

    return children;
});

const RequireAuth = observer(({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) => {
    const { sessionStore } = useCoreStores();
    const location = useLocation();

    if (!sessionStore.isInitialized) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    if (!sessionStore.session?.access_token) {
        return <Navigate to="/auth/login" state={{ from: location.pathname + location.search }} replace />;
    }

    if (requireAdmin && sessionStore.profile?.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return children;
});
