import { PostApi } from "src/core/api";


export class PostUseCase {
  constructor() {}

  async fetchInternal(
    filter: any,
    page: number,
    page_size: number = 25
  ): Promise<{ count: number; offset: number; list: any }> {
    const res = await PostApi.getListPost({ ...filter, page, page_size });
    return {
      list: res.Data?.data,
      count: res.Data?.total,
      offset: 0
    }
  }

  async fetchFollowingPost(
    filter: any,
    page: number,
    page_size: number = 25
  ): Promise<{ count: number; offset: number; list: any }> {
    const res = await PostApi.getFollowingPost({ ...filter, page, page_size });
    return {
      list: res.Data?.data,
      count: res.Data?.total,
      offset: 0
    }
  }
}
