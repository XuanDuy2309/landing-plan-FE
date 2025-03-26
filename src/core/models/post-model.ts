import moment from "moment";
import { Status } from "./user-model";
import { makeAutoObservable } from "mobx";

export class PostModel {
    id?: number;
    user_id?: number;
    user_name?: string;
    title?: string;
    content?: string;
    image_links?: string[] = [];
    group_id?: number;
    group_name?: string;
    type: string = '3';
    status: string = '1';
    price_start?: number;
    price_current?: number;
    purpose: string = '1';
    lat?: number;
    lng?: number;
    address?: string;
    province_id?: number;
    district_id?: number;
    ward_id?: number;
    created_at?: moment.Moment;
    updated_at?: moment.Moment;
    constructor() {
        makeAutoObservable(this)
    }
}