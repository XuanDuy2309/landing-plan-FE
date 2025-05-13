import { observer } from "mobx-react"
import { PostContextProvider } from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { FollowingPostContainer } from "../containers/home/following-post-container"
import { LeftSideHome } from "../containers/home/left-side-home"

interface IProps {
    id?: number
}

export const FollowPost = observer(({ id }: IProps) => {
    const { sessionStore } = useCoreStores()
    const { profile } = sessionStore
    const idTemp = id || profile?.id
    return (
        <PostContextProvider id={idTemp} following>
            <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto relative">
                <div className="w-1/3 flex-none min-w-[280px] h-full">
                    <LeftSideHome />
                </div>
                <FollowingPostContainer />
            </div>
        </PostContextProvider>
    )
})