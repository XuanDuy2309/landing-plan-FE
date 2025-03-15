import { Route, Routes } from "react-router-dom";
import { LandingMapScreen } from "./screens/landing-map-screen";

export const LandingMapRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingMapScreen />} />
        </Routes>
    );
};