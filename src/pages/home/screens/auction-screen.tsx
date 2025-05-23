import classNames from "classnames";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { usePostSocketRoom } from "src/core/hook";
import { PostDetailContextProvider, usePostDetailContext } from "src/core/modules/post";
import { ContentAuctionContainer } from "../containers/auction/content-auction-container";
import { ContentDetailPost } from "../containers/post-detail/content-detail-post";

export const AuctionScreen = observer(() => {
    const { id } = useParams<{ id: string }>();

    usePostSocketRoom(id ? Number(id) : undefined);
    return (
        <PostDetailContextProvider id={id ? Number(id) : undefined}>
            <Auction />
        </PostDetailContextProvider>
    )
})

const Auction = observer(() => {
    const { zoom } = usePostDetailContext()

    return (
        <div className="w-full h-full flex bg-gray-200">

            <div className={classNames("h-full flex flex-col transition-discrete ease-linear duration-500",
                { 'w-1/3': zoom },
                { 'w-0': !zoom },
            )}>
                {zoom && <ContentDetailPost />}
            </div>

            <div className={classNames("w-full h-full flex items-center overflow-x-hidden ",

            )}>
                <ContentAuctionContainer />
            </div>
        </div>
    )
}
)