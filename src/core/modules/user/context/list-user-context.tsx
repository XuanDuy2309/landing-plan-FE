
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { UserModel } from "src/core/models";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
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
}

export const ListUserContext = React.createContext<ListUserContextType>(new ListUserContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
}

export const ListUserContextProvider = observer(({ children, id, following }: IProps) => {
    const context = useBaseContextProvider<FilterListUserContextType, UserModel>(new FilterListUserContextType(), request)

    async function request(
        filter: FilterListUserContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: UserModel[]; offset: number }> {
        const uc = new UserUseCase()

        const res = await uc.fetchInternal({ ...filter, user_id: id }, index, pageSize)
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

    return (
        <ListUserContext.Provider value={{ ...context, onLikeUser, onUnLikeUser }}>
            {children}
        </ListUserContext.Provider>
    )
})

export const useListUserContext = () => {
    return React.useContext(ListUserContext);
}