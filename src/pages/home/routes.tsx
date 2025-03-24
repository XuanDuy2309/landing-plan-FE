import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "./screens/home-screen";
import { ProfileLayout } from "src/layouts/profile/profile-layout";
import { ProfileImageScreen } from "./screens/profile-image-screen";

export const HomeRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="/" element={<ProfileLayout />}>
                <Route path="my_post" element={<HomeScreen />} />
                <Route path="image" element={<ProfileImageScreen />} />
            </Route>
        </Routes>
    );
};