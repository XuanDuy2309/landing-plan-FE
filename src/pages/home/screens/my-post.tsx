import { observer } from "mobx-react"
import { PostContextProvider } from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { LeftSideHome } from "../containers/home/left-side-home"
import { MyPostContainer } from "../containers/home/my-post-container"

export const MyPost = observer(() => {
    const { sessionStore } = useCoreStores()
    const { profile } = sessionStore
    return (
        <PostContextProvider id={profile?.id}>
            <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto relative">
                <div className="w-1/3 flex-none min-w-[280px] h-full">
                    <LeftSideHome />
                </div>
                <MyPostContainer />
            </div>
        </PostContextProvider>
    )
})