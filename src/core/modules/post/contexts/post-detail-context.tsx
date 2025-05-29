import { observer } from "mobx-react";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { PostApi } from "src/core/api";
import { BidsApi } from "src/core/api/bids.api";
import { BIDModel, PostModel } from "src/core/models";

export class PostDetailContextType {
    data: PostModel = new PostModel();
    zoom: boolean = false;
    dataAuction: BIDModel = new BIDModel();
    setZoom: (zoom: boolean) => void = (zoom: boolean) => { };
    setBid!: () => Promise<any>;
    onRefresh: () => Promise<any> = async () => { };
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
        }
    }

    const fetchDataAuction = async (id) => {
        const res = await BidsApi.getBids({ id });
        if (res.Status) {
            data.bids = res.Data.data.map((item) => {
                const bid = new BIDModel();
                Object.assign(bid, item);
                bid.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm');
                return bid;
            })
            data.price_current = data.bids[0]?.price || 0;
            dataAuction.price = data.price_current;
        }
    }

    const setBid = async () => {
        if (!dataAuction.price || dataAuction.price <= 0) {
            dataAuction.err_price = "Giá đấu giá không được để trống";
            return;
        }

        if (dataAuction.price < (data.price_current || 0)) {
            dataAuction.err_price = "Giá đấu giá phải lớn hơn giá hiện tại";
            return;
        }

        if (dataAuction.price > ((data.price_current || 0) + (data.max_bid || 0))) {
            dataAuction.err_price = "Giá đấu giá vượt quá giá tối đa có thể đặt";
            return;
        }

        const params = {
            "price": dataAuction.price,
            "post_id": id,
        }

        const res = await BidsApi.createBid(params);
        if (res.Status) {
            fetchDataAuction(id);
        }
        return res;
    }

    const onRefresh = async () => {
        await fetchData(id);
        await fetchDataAuction(id);
    }

    useEffect(() => {
        if (id) {
            fetchData(id);
            fetchDataAuction(id);
        }
    }, [id]);
    return (
        <PostDetailContext.Provider value={{
            data,
            zoom,
            dataAuction,
            setZoom,
            setBid,
            onRefresh
        }}>
            {children}
        </PostDetailContext.Provider>
    )
})

export const usePostDetailContext = () => {
    return useContext(PostDetailContext);
}
