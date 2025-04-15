import { observer } from "mobx-react";
import { CreatePostContainer } from "./create-post-container";
import { usePostContext } from "src/core/modules";
import InfiniteScroll from "react-infinite-scroll-component";
import { ItemPost } from "../../components/home/item-post";

export const HomeContainer = observer(() => {
    const { data } = usePostContext()
    return (
        <div className="w-full h-full flex flex-col items-center space-y-4 overflow-y-auto">
            <CreatePostContainer />
            {
                data && data.length > 0 &&
                data.map((item, index) => {
                    return (
                        <ItemPost key={index} item={item} />
                    )
                })
            }
        </div>
    );
})