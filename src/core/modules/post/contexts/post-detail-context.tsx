import { observer } from "mobx-react";
import moment from "moment";
import React, { use, useContext, useEffect } from "react";
import { PostApi } from "src/core/api";
import { BIDModel, Direction_Land_Enum, PostModel, Purpose_Post, Status_Post, Type_Asset_Enum, Type_Post } from "src/core/models";

export class PostDetailContextType {
    data: PostModel = new PostModel();
    zoom: boolean = false;
    dataAuction: BIDModel = new BIDModel();
    setZoom: (zoom: boolean) => void = (zoom: boolean) => { };
}

export const PostDetailContext = React.createContext<PostDetailContextType>(new PostDetailContextType());

interface IProps {
    children: React.ReactNode
    id?: number
}

export const PostDetailContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<PostModel>(new PostModel());
    const [dataAuction, setDataAuction] = React.useState<BIDModel>(new BIDModel());
    const [zoom, setZoom] = React.useState<boolean>(false);

    const fetchData = async (id) => {
        const res = await PostApi.getDetailPost({ id });
        if (res.Status) {
            Object.assign(data, res.Data.data);
            data.image_links = JSON.parse(res.Data.data.image_links);
            data.video_links = JSON.parse(res.Data.data.video_links);
        }
    }

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);
    return (
        <PostDetailContext.Provider value={{
            data,
            zoom,
            dataAuction,
            setZoom
        }}>
            {children}
        </PostDetailContext.Provider>
    )
})

export const usePostDetailContext = () => {
    return useContext(PostDetailContext);
}