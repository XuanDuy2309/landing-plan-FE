import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../../../api";
import { Direction_Land_Enum, PostModel, Purpose_Post, Status_Post, Type_Asset_Enum, Type_Post } from "../../../models";
import { makeObservable, observable } from "mobx";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import moment from "moment";


export class FilterPostContextType extends IContextFilter {
    @observable purpose: Purpose_Post[] = []
    @observable type_asset: Type_Asset_Enum[] = []
    @observable price_start?: string
    @observable price_end?: string
    @observable area_start?: string
    @observable area_end?: string
    constructor() {
        super();
        makeObservable(this)
    }
}

export class PostContextType extends IBaseContextType<PostModel, FilterPostContextType> {
}

export const PostContext = React.createContext<PostContextType>(new PostContextType());

interface IProps {
    children: React.ReactNode
}

const data: PostModel[] = [

    {
        id: 202,
        type: Type_Post.Public,
        purpose: Purpose_Post.For_Auction,
        type_asset: Type_Asset_Enum.Land,
        status: Status_Post.Process,
        image_links: [
            "https://cdn.example.com/images/land1.jpg"
        ],
        video_links: [],
        coordinates: { lat: 10.758, lng: 106.648 },
        direction_land: Direction_Land_Enum.South,
        area: "150",
        width: "10",
        height: "15",
        price_start: 1000000000,
        price_current: 1250000000,
        bid_step: 50000000,
        max_bid: 1300000000,
        bids: [
            {
                id: 1,
                post_id: 202,
                price: 1100000000,
                create_by_name: "Nguyễn Văn A",
                create_by: 101,
                create_at: moment().subtract(2, "hours").toISOString()
            },
            {
                id: 2,
                post_id: 202,
                price: 1200000000,
                create_by_name: "Trần Thị B",
                create_by: 102,
                create_at: moment().subtract(1, "hour").toISOString()
            },
            {
                id: 3,
                post_id: 202,
                price: 1250000000,
                create_by_name: "Lê Văn C",
                create_by: 103,
                create_at: moment().subtract(30, "minutes").toISOString()
            }
        ],
        date_start: moment().subtract(1, "day"),
        date_end: moment().add(2, "days"),
        number_floors: undefined,
        number_bedrooms: undefined,
        number_bathrooms: undefined,
        room_number: undefined,
        in_alley: 0,
        title: "Đấu giá lô đất trung tâm Quận 9",
        description: "Vị trí đẹp, gần khu công nghệ cao, thuận tiện xây dựng nhà xưởng hoặc biệt thự mini.",
        lng: "106.648",
        lat: "10.758",
        address: "Đường số 2, Phường Tăng Nhơn Phú B, TP Thủ Đức",
        province_id: 79,
        district_id: 769,
        ward_id: 27161,
        province_name: "TP. Hồ Chí Minh",
        district_name: "TP Thủ Đức",
        ward_name: "Phường Tăng Nhơn Phú B",
        is_owner: true,
        owner_name: "Phạm Văn D",
        owner_phone: "0912345678",
        group_id: 10,
        create_by_id: 999,
        create_by_name: "Nguyễn Quang E",
        create_by_phone: "0901122334",
        create_by_avatar: "https://cdn.example.com/avatars/user999.jpg",
        create_at: moment().subtract(3, "days"),
        update_at: moment(),
        number_share: 5,
        like_by_ids: [2, 5, 7],
    
        // Không lỗi
        err_create_by_name: undefined,
        err_create_by_phone: undefined,
        err_title: undefined,
        err_image: undefined,
        err_lng: undefined,
        err_lat: undefined,
        err_coordinate: undefined,
        err_area: undefined,
        err_width: undefined,
        err_height: undefined,
        err_price_for_buy: undefined,
        err_price_for_rent: undefined,
        err_price_start: undefined,
        err_price_current: undefined,
        err_date_start: undefined,
        err_date_end: undefined,
        err_number_floors: undefined,
        err_number_bedrooms: undefined,
        err_number_bathrooms: undefined,
        err_owner_name: undefined,
        err_owner_phone: undefined,
    }

]

export const PostContextProvider = observer(({ children }: IProps) => {
    const context = useBaseContextProvider<FilterPostContextType, PostModel>(new FilterPostContextType(), request)

    async function request(
        filter: FilterPostContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: PostModel[]; offset: number }> {

        return {
            count: 0,
            list: [...data],
            offset: 0
        }
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <PostContext.Provider value={{ ...context }}>
            {children}
        </PostContext.Provider>
    )
})

export const usePostContext = () => {
    return React.useContext(PostContext);
}