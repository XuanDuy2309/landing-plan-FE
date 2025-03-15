import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "./screens/home-screen";

export const HomeRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeScreen />} />
        </Routes>
    );
};