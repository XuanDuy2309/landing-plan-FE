import { observer } from "mobx-react";
import { PostContextProvider } from "src/core/modules";
import { useCoreStores } from "../../../core/stores";
import { HomeContainer } from "../containers/home/home-container";
import { LeftSideHome } from "../containers/home/left-side-home";

export const HomeScreen = observer(() => {
    const { sessionStore } = useCoreStores();
    return (
        <PostContextProvider home>
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