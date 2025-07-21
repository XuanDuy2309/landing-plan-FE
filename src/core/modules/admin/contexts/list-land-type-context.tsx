import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { LandingMapApi } from "src/core/api";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { LandingTypeModel } from "../../../models";


export class FilterListLandTypeContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class ListLandTypeContextType extends IBaseContextType<LandingTypeModel, FilterListLandTypeContextType> {
    onDeleteItem!: (id?: number) => Promise<any>
}

export const ListLandTypeContext = React.createContext<ListLandTypeContextType>(new ListLandTypeContextType());

interface IProps {
    children: React.ReactNode
}

export const ListLandTypeContextProvider = observer(({ children }: IProps) => {
    const context = useBaseContextProvider<FilterListLandTypeContextType, LandingTypeModel>(new FilterListLandTypeContextType(), request)


    async function request(
        filter: FilterListLandTypeContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: LandingTypeModel[]; offset: number }> {
        const res = await LandingMapApi.getListLandType({ ...filter, page: index, page_size: pageSize })
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    const onDeleteItem = async (id?: number) => {
        if (!id) return
        const res = await LandingMapApi.deleteLandType({ id })
        return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <ListLandTypeContext.Provider value={{ ...context, onDeleteItem }}>
            {children}
        </ListLandTypeContext.Provider>
    )
})

export const useListLandTypeContext = () => {
    return React.useContext(ListLandTypeContext);
}