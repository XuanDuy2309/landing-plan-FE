import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../api";
import { PostModel } from "../models";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../base";
import { makeAutoObservable, makeObservable } from "mobx";


export class FilterPostContextType extends IContextFilter {
    constructor() {
        super();
        makeObservable(this)
    }
}

export class PostContextType extends IBaseContextType<PostModel, FilterPostContextType> {
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

        return {
            count: 0,
            list: [],
            offset: 0
        }
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <PostContext.Provider value={{ ...context }}>
            {children}
        </PostContext.Provider>
    )
})

export const usePostContext = () => {
    return React.useContext(PostContext);
}