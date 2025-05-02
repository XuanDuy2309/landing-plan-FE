import { observer } from "mobx-react";
import { JSX, useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { useNotificationStore } from "./core/context";
import { socketService } from "./core/services";
import { useCoreStores } from "./core/stores";
import { HomeLayout } from "./layouts/home/home-layout";
import { AuthRoutes } from "./pages/auth/routes";
import { HomeRoutes } from "./pages/home/routes";
import { AuctionScreen } from "./pages/home/screens/auction-screen";
import { PostDetailScreen } from "./pages/home/screens/post-detail";
import { ProfileDetail } from "./pages/home/screens/profile-detail";
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
    }, []);
    return (
        <div className="w-screen h-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingMapRoutes />} />
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
                        <Route path="profile/:id" element={
                            <RequireAuth>
                                <ProfileDetail />
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
                    <Route path="profile/:id" element={
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


    if (sessionStore.session) {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }
    return children;
});

const RequireAuth = observer(({ children }: { children: JSX.Element }) => {
    const { sessionStore } = useCoreStores();
    const location = useLocation();

    if (!sessionStore.session?.access_token) {
        // Lưu lại đường dẫn hiện tại để chuyển hướng sau khi đăng nhập
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    return children;
});