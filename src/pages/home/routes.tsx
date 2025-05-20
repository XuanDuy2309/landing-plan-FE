import { Route, Routes } from "react-router-dom";
import { Type_List } from "src/core/modules";
import { ProfileLayout } from "src/layouts/profile/profile-layout";
import { FollowPost } from "./screens/following-post";
import { FollowingScreen } from "./screens/following-screen";
import { HomeScreen } from "./screens/home-screen";
import { MemberScreen } from "./screens/members-screen";
import { MessageScreen } from "./screens/message-screen";
import { MyPost } from "./screens/my-post";
import { ProfileDetailScreen } from "./screens/profile-detail";
import { ProfileImageScreen } from "./screens/profile-image-screen";

export const HomeRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="member" element={<MemberScreen />} />
            <Route path="message" element={<MessageScreen />} />
            <Route path="profile/*" element={<ProfileLayout />}>
                <Route index element={<MyPost />} />
                <Route path="folowing_post" element={<FollowPost />} />
                <Route path="image" element={<ProfileImageScreen />} />
                <Route path="follower" element={<FollowingScreen type={Type_List.Follower} key={Type_List.Follower} />} />
                <Route path="following" element={<FollowingScreen type={Type_List.Following} key={Type_List.Following} />} />
            </Route>
            <Route path="/profile/:id" element={<ProfileDetailScreen />} />
        </Routes>
    );
};