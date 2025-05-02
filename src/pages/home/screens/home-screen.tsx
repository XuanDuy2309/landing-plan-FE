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
        <PostContextProvider>
            <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto">
                <div className="w-1/3 max-w-[480px] min-w-[280px] h-full flex-none">
                    <LeftSideHome />
                </div>
                <div className="w-2/3 h-full pr-4">
                    <HomeContainer />
                </div>
            </div>
        </PostContextProvider>
    );
})