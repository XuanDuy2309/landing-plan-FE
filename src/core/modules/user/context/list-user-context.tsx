
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { AuthApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { UserModel } from "src/core/models";
import { useCoreStores } from "src/core/stores";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { Type_List } from "../../members";
import { UserUseCase } from "../usecase";


export class FilterListUserContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class ListUserContextType extends IBaseContextType<UserModel, FilterListUserContextType> {
    onLikeUser: (id: number) => Promise<any> = async (id: number) => { }
    onUnLikeUser: (id: number) => Promise<any> = async (id: number) => { }
    onToggleStatus: (id: number) => Promise<any> = async (id: number) => { }
}

export const ListUserContext = React.createContext<ListUserContextType>(new ListUserContextType());

interface IProps {
    children: React.ReactNode
    type?: Type_List
    id?: number
}

export const ListUserContextProvider = observer(({ children, type, id }: IProps) => {
    const context = useBaseContextProvider<FilterListUserContextType, UserModel>(new FilterListUserContextType(), request)
    const { sessionStore } = useCoreStores()

    async function request(
        filter: FilterListUserContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: UserModel[]; offset: number }> {
        const uc = new UserUseCase()

        let res = {
            count: 0,
            list: [],
            offset: 0
        }
        if (type === Type_List.User) { res = await uc.fetchInternal({ ...filter, excludeIds: [sessionStore.profile?.id] }, index, pageSize) }
        if (type === Type_List.Follower) { res = await uc.fetchFollowers({ ...filter, user_id: id ? id : null }, index, pageSize) }
        if (type === Type_List.Following) { res = await uc.fetchFollowing({ ...filter, user_id: id ? id : null }, index, pageSize) }
        if (type === Type_List.Member) { res = await uc.fetchMembers(id || 0, { ...filter }, index, pageSize) }
        return {
            ...res,
        }
    }

    const onLikeUser = async (id: number) => {
        // const res = await UserApi.likeUser({ id })
        // return res
    }

    const onUnLikeUser = async (id: number) => {
        // const res = await UserApi.unlike({ id })
        // return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    const changeStatusUser = async (id: number) => {
        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }
        res = await AuthApi.toggleStatus({ id })
        if (res.Status) {
            return res
        }
        return
    }

    return (
        <ListUserContext.Provider value={{ ...context, onLikeUser, onUnLikeUser, onToggleStatus: changeStatusUser }}>
            {children}
        </ListUserContext.Provider>
    )
})

export const useListUserContext = () => {
    return React.useContext(ListUserContext);
}
