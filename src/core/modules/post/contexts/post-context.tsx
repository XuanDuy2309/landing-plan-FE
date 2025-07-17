import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { PostApi } from "../../../api";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { PostModel, Purpose_Post, Status_Post, Type_Asset_Enum } from "../../../models";
import { PostUseCase } from "../usecase";


export class FilterPostContextType extends IContextFilter {
    @observable status?: Status_Post
    @observable purpose: Purpose_Post[] = []
    @observable type_asset: Type_Asset_Enum[] = []
    @observable price_start?: string
    @observable price_end?: string
    @observable area_start?: string
    @observable area_end?: string
    @observable lat?: number
    @observable lng?: number
    @observable range?: number
    @observable type_landing_ids: number[] = []
    @observable type_landing: any = []
    constructor() {
        super();
        makeObservable(this)
    }
}

export class PostContextType extends IBaseContextType<PostModel, FilterPostContextType> {
    onLikePost: (id: number) => Promise<any> = async (id: number) => { }
    onUnLikePost: (id: number) => Promise<any> = async (id: number) => { }
    onDeletePost: (id: number) => Promise<any> = async (id: number) => { }
}

export const PostContext = React.createContext<PostContextType>(new PostContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
    purpose?: Purpose_Post
    home?: boolean
}

export const PostContextProvider = observer(({ children, id, following, purpose, home }: IProps) => {
    const context = useBaseContextProvider<FilterPostContextType, PostModel>(new FilterPostContextType(), request)


    async function request(
        filter: FilterPostContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: PostModel[]; offset: number }> {
        const uc = new PostUseCase()
        let res = {
            count: 0,
            list: [],
            offset: 0
        }
        if (following) {
            res = await uc.fetchFollowingPost({ ...filter }, index, pageSize)
        }
        else if (purpose) {
            res = await uc.fetchInternal({ ...filter, purpose: [Purpose_Post.For_Auction] }, index, pageSize)
        }
        else if (home) {
            res = await uc.fetchInternal({ ...filter, user_id: id, status: Status_Post.Process }, index, pageSize)
        }
        else {
            res = await uc.fetchInternal({ ...filter}, index, pageSize)
        }
        return {
            ...res,
        }
    }

    const onLikePost = async (id: number) => {
        const res = await PostApi.likePost({ id })
        return res
    }

    const onUnLikePost = async (id: number) => {
        const res = await PostApi.unlike({ id })
        return res
    }

    const onDeletePost = async (id: number) => {
        const res = await PostApi.deletePost({ id })
        return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <PostContext.Provider value={{ ...context, onLikePost, onUnLikePost, onDeletePost }}>
            {children}
        </PostContext.Provider>
    )
})

export const usePostContext = () => {
    return React.useContext(PostContext);
}