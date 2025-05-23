import { makeAutoObservable } from "mobx";
import moment from "moment";

export enum Type_Post {
    Public = 1,
    Follow = 2,
    Private = 3,
}

export enum Purpose_Post {
    For_Sell = 1,
    For_Rent = 2,
    For_Auction = 3
}

export enum Status_Post {
    Coming_Soon = 1,
    Process = 2,
    End = 3
}

export enum Direction_Land_Enum {
    North = 1,
    South = 2,
    East = 3,
    West = 4,
    North_West = 5,
    North_East = 6,
    South_West = 7,
    South_East = 8
}

export enum Type_Asset_Enum {
    Home = 1,
    Land = 2,
    Apartment = 3,
    Warehouse = 4,
    Office = 5,
    Motel = 6,
    Hotel = 7,
    Other = 8
}

export class BIDModel {
    id?: number
    post_id?: number
    price?: number
    user_name?: string
    user_id?: number
    create_at?: string
    constructor() {
        makeAutoObservable(this)
    }
}

export class PostModel {
    id?: number;
    type: Type_Post = Type_Post.Public;
    purpose: Purpose_Post = Purpose_Post.For_Sell;
    type_asset: Type_Asset_Enum = Type_Asset_Enum.Home;
    status: Status_Post = Status_Post.Coming_Soon;
    image_links: string[] = []
    video_links: string[] = []
    coordinates?: any
    direction_land: Direction_Land_Enum = Direction_Land_Enum.North
    area?: number
    width?: number
    height?: number
    price_for_buy?: number
    price_for_rent?: number
    price_start?: number
    price_current?: number
    bid_step?: number
    max_bid?: number
    bids: BIDModel[] = []
    start_date?: string
    end_date?: string
    number_floors?: number
    number_bedrooms?: number
    number_bathrooms?: number
    room_number?: number // số nhà (căn hộ chung cư)
    in_alley: number = 1
    title?: string
    description?: string
    lng?: number
    lat?: number
    address?: string
    province_id?: number
    district_id?: number
    ward_id?: number
    province_name?: string
    district_name?: string
    ward_name?: string
    is_owner: boolean = true
    owner_name?: string
    owner_phone?: string
    group_id?: number
    create_by_id?: number
    create_by_name?: string
    create_by_phone?: string
    create_by_avatar?: string
    create_by_email?: string
    create_at?: moment.Moment
    update_at?: moment.Moment
    share_count?: number
    like_by_ids: number[] = []

    err_create_by_name?: string
    err_create_by_phone?: string
    err_title?: string
    err_image?: string
    err_lng?: string
    err_lat?: string
    err_coordinate?: string
    err_area?: string
    err_width?: string
    err_height?: string
    err_price_for_buy?: string
    err_price_for_rent?: string
    err_price_start?: string
    err_price_current?: string
    err_date_start?: string
    err_date_end?: string
    err_number_floors?: string
    err_number_bedrooms?: string
    err_number_bathrooms?: string
    err_owner_name?: string
    err_owner_phone?: string
    err_step_bid?: string;
    err_max_bid?: string;


    constructor() {
        makeAutoObservable(this)
    }
}