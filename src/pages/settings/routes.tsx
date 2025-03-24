import { Route, Routes } from "react-router-dom";
import { SettingsInfoScreen } from "./screens/settings-info-screens";
import { SettingsLayout } from "src/layouts/settings/setting-layout";
import { SettingPassScreen } from "./screens/setting-pass-screen";

export const SettingsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SettingsLayout />} >
                <Route path="info" element={<SettingsInfoScreen />} />
                <Route path="pass" element={<SettingPassScreen />} />
            </Route>
        </Routes>
    );
};