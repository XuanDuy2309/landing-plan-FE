import { observer } from "mobx-react";
import { CreatePostContainer } from "./create-post-container";
import { usePostContext } from "src/core/modules";
import InfiniteScroll from "react-infinite-scroll-component";
import { ItemPost } from "../../components/home/item-post";

export const HomeContainer = observer(() => {
    const { data, onLikePost, onUnLikePost } = usePostContext()
    return (
        <div className="w-full h-full flex flex-col items-center space-y-4 overflow-y-auto scroll-hide">
            <CreatePostContainer />
            {
                data && data.length > 0 &&
                data.map((item, index) => {
                    return (
                        <ItemPost key={index} item={item} onLike={(id) => {
                            onLikePost(id)
                        }}
                            onUnlike={(id) => {
                                onUnLikePost(id)
                            }}
                        />
                    )
                })
            }
        </div>
    );
})