import { Spin } from "antd";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostModel } from "src/core/models";
import { usePostContext } from "src/core/modules";
import { ItemPost } from "../../components/home/item-post";
import { CreatePostContainer } from "./create-post-container";

export const MyPostContainer = observer(() => {
    const { data, onLikePost, onUnLikePost, hasMore, fetchMore, onRefresh, loading } = usePostContext()
    return (
        <div id="my_post_container" className="w-full h-full flex flex-col items-center overflow-y-auto space-y-4 py-4 pr-3 min-h-0 scroll-hide">
            <InfiniteScroll dataLength={data.length} //This is important field to render the next data
                next={() => {
                    fetchMore()
                }}
                hasMore={hasMore()}
                refreshFunction={onRefresh}
                loader={<div className="w-full items-center justify-center flex">
                    <Spin />
                </div>}
                scrollableTarget="my_post_container"
                style={{ overflow: 'none' }}>
                <div className="w-full h-full flex flex-col space-y-4">
                    <CreatePostContainer />
                    {!loading && data.map((item: PostModel, index) =>
                        <ItemPost key={index} item={item} onLike={(id) => {
                            onLikePost(id)
                        }}
                            onUnlike={(id) => {
                                onUnLikePost(id)
                            }}
                        />
                    )}
                    {
                        !loading && data.length === 0 && <div className="w-full h-full items-center justify-center flex">

                            <span className="text-lg text-gray-700">Chưa có bài viết nào</span>
                        </div>
                    }
                    {loading && <div className="w-full items-center justify-center flex">
                        <Spin />
                    </div>
                    }
                </div>
            </InfiniteScroll>
        </div>
    );
})