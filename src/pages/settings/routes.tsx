import { Route, Routes } from "react-router-dom";
import { SettingsInfoScreen } from "./screens/settings-info-screens";
import { UserContextProvider } from "src/core/modules";
import { SettingsLayout } from "src/layouts/settings/setting-layout";

export const SettingsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SettingsLayout />} >
                <Route path="info" element={<SettingsInfoScreen />} />
            </Route>
        </Routes>
    );
};