import { AuthApi } from "src/core/api";


export class UserUseCase {
    constructor() { }

    async fetchInternal(
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await AuthApi.getListUser({ ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    async fetchFollowers(
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await AuthApi.getFollowers({ ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    async fetchFollowing(
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await AuthApi.getFollowing({ ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }
}
