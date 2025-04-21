import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi, PostApi } from "../../../api";
import { Direction_Land_Enum, PostModel, Purpose_Post, Status_Post, Type_Asset_Enum, Type_Post } from "../../../models";
import { makeObservable, observable } from "mobx";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import moment from "moment";
import { PostUseCase } from "../usecase";
import { SessionStore, useCoreStores } from "src/core/stores";


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
    onLikePost: (id: number) => Promise<any> = async (id: number) => {}
    onUnLikePost: (id: number) => Promise<any> = async (id: number) => {}
}

export const PostContext = React.createContext<PostContextType>(new PostContextType());

interface IProps {
    children: React.ReactNode
}

export const PostContextProvider = observer(({ children }: IProps) => {
    const context = useBaseContextProvider<FilterPostContextType, PostModel>(new FilterPostContextType(), request)

    async function request(
        filter: FilterPostContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: PostModel[]; offset: number }> {
        const uc = new PostUseCase()
        const res = await uc.fetchInternal(filter, index, pageSize)
        return {
            ...res,
        }
    }

    const onLikePost = async (id: number) => {
        const res = await PostApi.likePost({id})
        return res
    }

    const onUnLikePost = async (id: number) => {
        const res = await PostApi.unlike({id})
        return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <PostContext.Provider value={{ ...context, onLikePost, onUnLikePost }}>
            {children}
        </PostContext.Provider>
    )
})

export const usePostContext = () => {
    return React.useContext(PostContext);
}