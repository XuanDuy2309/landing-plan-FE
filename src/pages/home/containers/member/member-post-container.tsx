import { observer } from "mobx-react"
import { PostContextProvider } from "src/core/modules"
import { LeftSideHome } from "../home/left-side-home"
import { MemberPostContent } from "./member-post-content"

interface IProps {
    id?: number
}

export const MemberPostContainer = observer(({ id }: IProps) => {
    return (
        <PostContextProvider id={id} home>
            <div className="w-full h-full flex items-center justify-between max-w-[1440px] mx-auto relative">
                <div className="w-1/3 flex-none min-w-[280px] h-full">
                    <LeftSideHome />
                </div>
                <MemberPostContent />
            </div>
        </PostContextProvider>
    )
})