import { Route, Routes } from "react-router-dom";
import { ProfileLayout } from "src/layouts/profile/profile-layout";
import { FollowPost } from "./screens/following-post";
import { HomeScreen } from "./screens/home-screen";
import { MemberScreen } from "./screens/members-screen";
import { MyPost } from "./screens/my-post";
import { ProfileImageScreen } from "./screens/profile-image-screen";

export const HomeRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="member" element={<MemberScreen />} />
            <Route path="profile/*" element={<ProfileLayout />}>
                <Route path="my_post" element={<MyPost />} />
                <Route path="folowing_post" element={<FollowPost />} />
                <Route path="image" element={<ProfileImageScreen />} />
            </Route>
        </Routes>
    );
};