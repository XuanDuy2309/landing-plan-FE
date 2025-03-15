import { Route, Routes } from "react-router-dom";
import { SettingsInfoScreen } from "./screens/settings-info-screens";
import { UserContextProvider } from "src/core/modules";

export const SettingsRoutes = () => {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/info" element={<SettingsInfoScreen />} />
            </Routes>
        </UserContextProvider>
    );
};