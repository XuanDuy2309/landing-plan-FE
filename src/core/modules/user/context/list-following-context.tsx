
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { UserModel } from "src/core/models";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { UserUseCase } from "../usecase";


export class FilterFollowingContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class FollowingContextType extends IBaseContextType<UserModel, FilterFollowingContextType> {
    onLikeFollowing: (id: number) => Promise<any> = async (id: number) => { }
    onUnLikeFollowing: (id: number) => Promise<any> = async (id: number) => { }
}

export const FollowingContext = React.createContext<FollowingContextType>(new FollowingContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
}

export const FollowingContextProvider = observer(({ children, id, following }: IProps) => {
    const context = useBaseContextProvider<FilterFollowingContextType, UserModel>(new FilterFollowingContextType(), request)

    async function request(
        filter: FilterFollowingContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: UserModel[]; offset: number }> {
        const uc = new UserUseCase()

        const res = await uc.fetchFollowing({ ...filter, Following_id: id }, index, pageSize)
        return {
            ...res,
        }
    }

    const onLikeFollowing = async (id: number) => {
        // const res = await FollowingApi.likeFollowing({ id })
        // return res
    }

    const onUnLikeFollowing = async (id: number) => {
        // const res = await FollowingApi.unlike({ id })
        // return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <FollowingContext.Provider value={{ ...context, onLikeFollowing, onUnLikeFollowing }}>
            {children}
        </FollowingContext.Provider>
    )
})

export const useFollowingContext = () => {
    return React.useContext(FollowingContext);
}