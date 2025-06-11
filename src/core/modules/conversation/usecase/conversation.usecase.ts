import { ConversationsApi } from "src/core/api";


export class ConversationUseCase {
    constructor() { }

    async fetchInternal(
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await ConversationsApi.getListCoversation({ ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    async fetchMessage(
        id: number,
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await ConversationsApi.getListMessage(id, { ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }


    async fetchMedia(
        id: number,
        filter: any,
        page: number,
        page_size: number = 25
    ): Promise<{ count: number; offset: number; list: any }> {
        const res = await ConversationsApi.getListMedia(id, { ...filter, page, page_size });
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }
}
