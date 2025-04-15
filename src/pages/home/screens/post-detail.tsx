import { observer } from "mobx-react"
import { useParams } from "react-router-dom";
import { PostDetailContextProvider, usePostDetailContext } from "src/core/modules/post";
import { SliderDetailMediaPost } from "../containers/post-detail.tsx/slider-detail-media-post";
import classNames from "classnames";
import { ContentDetailPost } from "../containers/post-detail.tsx/content-detail-post";

export const PostDetailScreen = observer(() => {
    const { id } = useParams<{ id: string }>();
    return (
        <PostDetailContextProvider id={id ? Number(id) : undefined}>
            <PostDetail />
        </PostDetailContextProvider>
    )
})

const PostDetail = observer(() => {
    const { zoom } = usePostDetailContext()
    return (
        <div className="w-full h-full flex bg-gray-200">
            <div className={classNames("h-full flex items-center overflow-x-hidden transition-discrete ease-linear duration-500",
                { 'w-full': zoom },
                { 'w-2/3': !zoom },
            )}>
                <SliderDetailMediaPost />
            </div>
            {
                !zoom &&
                <div className="w-1/3 h-full flex flex-col">
                    <ContentDetailPost />
                </div>
            }
        </div>
    )
}
)