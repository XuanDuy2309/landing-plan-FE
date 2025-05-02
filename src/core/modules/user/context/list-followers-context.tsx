
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { UserModel } from "src/core/models";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { UserUseCase } from "../usecase";


export class FilterFollowerContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class FollowerContextType extends IBaseContextType<UserModel, FilterFollowerContextType> {
    onLikeFollower: (id: number) => Promise<any> = async (id: number) => { }
    onUnLikeFollower: (id: number) => Promise<any> = async (id: number) => { }
}

export const FollowerContext = React.createContext<FollowerContextType>(new FollowerContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
}

export const FollowerContextProvider = observer(({ children, id, following }: IProps) => {
    const context = useBaseContextProvider<FilterFollowerContextType, UserModel>(new FilterFollowerContextType(), request)

    async function request(
        filter: FilterFollowerContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: UserModel[]; offset: number }> {
        const uc = new UserUseCase()

        const res = await uc.fetchFollowers({ ...filter, Follower_id: id }, index, pageSize)
        return {
            ...res,
        }
    }

    const onLikeFollower = async (id: number) => {
        // const res = await FollowerApi.likeFollower({ id })
        // return res
    }

    const onUnLikeFollower = async (id: number) => {
        // const res = await FollowerApi.unlike({ id })
        // return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <FollowerContext.Provider value={{ ...context, onLikeFollower, onUnLikeFollower }}>
            {children}
        </FollowerContext.Provider>
    )
})

export const useFollowerContext = () => {
    return React.useContext(FollowerContext);
}