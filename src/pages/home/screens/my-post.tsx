import { observer } from "mobx-react"
import { PostContextProvider } from "src/core/modules"
import { LeftSideHome } from "../containers/home/left-side-home"
import { HomeContainer } from "../containers/home/home-container"

export const MyPost = observer(() => {
    return (
        <PostContextProvider>
            <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto">
                <div className="w-2/5 min-w-[280px] h-full">
                    <LeftSideHome />
                </div>
                <div className="w-full h-full py-4">
                    <HomeContainer />
                </div>
            </div>
        </PostContextProvider>
    )
})