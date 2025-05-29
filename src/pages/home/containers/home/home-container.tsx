import { Spin } from "antd";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostModel } from "src/core/models";
import { usePostContext } from "src/core/modules";
import { ItemPost } from "../../components/home/item-post";
import { CreatePostContainer } from "./create-post-container";

export const HomeContainer = observer(() => {
    const { data, onLikePost, onUnLikePost, hasMore, fetchMore, onRefresh } = usePostContext()
    return (
        <div id="post_container" className="w-full py-4 h-full flex flex-col items-center overflow-y-auto scroll-hide">
            <InfiniteScroll
                dataLength={data.length} //This is important field to render the next data
                next={() => {
                    fetchMore()
                }}
                hasMore={hasMore()}
                refreshFunction={onRefresh}
                loader={<div className="w-full items-center justify-center flex">
                    <Spin />
                </div>}
                scrollableTarget="post_container"
                style={{ overflow: 'none' }}
            >
                <div className="w-full h-full flex flex-col gap-4">
                    <CreatePostContainer />
                    {data.map((item: PostModel, index) =>
                        <ItemPost key={index} item={item} onLike={(id) => {
                            onLikePost(id)
                        }}
                            onUnlike={(id) => {
                                onUnLikePost(id)
                            }}
                        />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
})