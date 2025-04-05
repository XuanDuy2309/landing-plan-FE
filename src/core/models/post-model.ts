import moment from "moment";
import { Status } from "./user-model";
import { makeAutoObservable } from "mobx";

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
    Waiting = 1,
    Accept = 2,
    Reject = 3
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

export class PostModel {
    id?: number;
    type: Type_Post = Type_Post.Public;
    purpose: Purpose_Post = Purpose_Post.For_Sell;
    type_asset: Type_Asset_Enum = Type_Asset_Enum.Home;
    status: Status_Post = Status_Post.Waiting;
    image_links: string[] = []
    video_links: string[] = []
    contract_links: string[] = []
    coordinates?: any
    direction_land: Direction_Land_Enum = Direction_Land_Enum.North
    area?: string
    width?: string
    height?: string
    price_for_buy?: string
    price_for_rent?: string
    price_start?: string
    price_current?: string
    date_start?: moment.Moment
    date_end?: moment.Moment
    number_floors?: number
    number_bedrooms?: number
    number_bathrooms?: number
    room_number?: number // số nhà (căn hộ chung cư)
    in_alley: number = 1
    title?: string
    description?: string
    lng?: string
    lat?: string
    address?: string
    province_id?: number
    district_id?: number
    ward_id?: number
    province_name?: string
    district_name?: string
    ward_name?: string
    is_owner: boolean = false
    owner_name?: string
    owner_phone?: string
    group_id?: number
    create_by_id?: number
    create_by_name?: string
    create_by_phone?: string
    create_at?: moment.Moment
    update_at?: moment.Moment

    err_create_by_name?: string
    err_create_by_phone?: string
    err_title?: string
    err_image?: string
    err_lng?: string
    err_lat?: string
    err_coordinate?:string
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


    constructor() {
        makeAutoObservable(this)
    }
}