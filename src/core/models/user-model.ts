import { makeAutoObservable } from "mobx";

export enum Role {
    admin = 'admin',
    user = 'user'
}

export enum Status {
    active = 'active',
    inactive = 'inactive'
}

export enum Gender {
    male = 'male',
    female = 'female',
    other = 'other'
}

export class UserModel {
    id?: number;
    username?: string;
    password?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    confirm_password?: string;
    fullname?: string;
    role: Role = Role.user;
    status: Status = Status.active;
    gender: Gender = Gender.male;
    dob?: string;
    follower_ids?: number[];
    following_ids?: number[];
    avatar?: string;
    background?: string;
    created_at?: string;

    err_username?: string;
    err_password?: string;
    err_confirm_password?: string;
    err_fullname?: string;
    err_email?: string;
    err_phone_number?: string;

    constructor() {
        makeAutoObservable(this)
    }
}