import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthRoutes } from "./pages/auth/routes";
import { JSX } from "react";
import { useCoreStores } from "./core/stores";
import { LandingMapRoutes } from "./pages/landing-map/routes";
import { HomeRoutes } from "./pages/home/routes";
import { observer } from "mobx-react";
import { HomeLayout } from "./layouts/home/home-layout";
import { SettingsRoutes } from "./pages/settings/routes";
import { SettingsLayout } from "./layouts/settings/setting-layout";
import { Spin } from "antd";


export const AppRouter = observer(() => {
    return (
        <div className="w-screen h-screen">
            <Router>
                <Routes>
                    <Route path="/landing_map" element={<LandingMapRoutes />} />
                    <Route path="auth/*" element={
                        <SkipAuth>
                            <AuthRoutes />
                        </SkipAuth>} />
                    <Route path="/" element={<HomeLayout />}>
                        <Route path="home/*" element={
                            <RequireAuth>
                                <HomeRoutes />
                            </RequireAuth>
                        } />
                        <Route path="settings/*" element={
                            <RequireAuth>
                                <SettingsRoutes />
                            </RequireAuth>
                        }>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </div>
    );

})

const SkipAuth = observer(({ children }: { children: JSX.Element }) => {
    const { sessionStore } = useCoreStores();

    if (sessionStore.session) {
        return <Navigate to="/home" />;
    }
    return children;
})

const RequireAuth = observer(({ children }: { children: JSX.Element }) => {
    const { sessionStore } = useCoreStores();

    if (!sessionStore.session?.access_token) {
        return <Navigate to="/auth/login" />;
    }
    return children;
})