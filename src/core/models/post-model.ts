import { Status } from "./user-model";

export class PostModel {
    id?: number;
    user_id?: number;
    user_name?: string;
    title?: string;
    content?: string;
    images: string[] = [];
    group_id?: number;
    group_name?: string;
    lat?: number;
    lng?: number;
    address?: string;
    status?: Status = Status.active;
    province_id?: number;
    district_id?: number;
    ward_id?: number;
    created_at?: string;
    updated_at?: string;
}