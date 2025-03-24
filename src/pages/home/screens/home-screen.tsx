import { observer } from "mobx-react";
import { useCoreStores } from "../../../core/stores";
import { AuthApi } from "../../../core/api";
import { LeftSideHome } from "../containers/home/left-side-home";
import { RightSideHome } from "../containers/home/right-side-home";
import { PostContextProvider } from "src/core/modules";
import { HomeContainer } from "../containers/home/home-container";

export const HomeScreen = observer(() => {
    const { sessionStore } = useCoreStores();
    return (
        <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto">
            <div className="w-1/4 max-w-[360px] min-w-[280px] h-full bg-red-300">
                <LeftSideHome />
            </div>
            <div className="w-full h-full max-w-[680px] py-4">
                <PostContextProvider>
                    <HomeContainer />
                </PostContextProvider>
            </div>
            <div className="w-1/4 max-w-[360px] min-w-[280px] h-full bg-blue-300">
                <RightSideHome />
            </div>
        </div>
    );
})