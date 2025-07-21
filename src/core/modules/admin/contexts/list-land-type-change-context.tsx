import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { LandingMapApi } from "src/core/api";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { LandTypeChangeModel, Purpose_Post } from "../../../models";


export class FilterLandTypeChangeContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class LandTypeChangeContextType extends IBaseContextType<LandTypeChangeModel, FilterLandTypeChangeContextType> {
    onDeleteItem!: (id?: number) => Promise<any>
}

export const LandTypeChangeContext = React.createContext<LandTypeChangeContextType>(new LandTypeChangeContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
    purpose?: Purpose_Post
}

export const LandTypeChangeContextProvider = observer(({ children, id, following, purpose }: IProps) => {
    const context = useBaseContextProvider<FilterLandTypeChangeContextType, LandTypeChangeModel>(new FilterLandTypeChangeContextType(), request)


    async function request(
        filter: FilterLandTypeChangeContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: LandTypeChangeModel[]; offset: number }> {
        const res = await LandingMapApi.getListLandTypeChange({ ...filter, page: index, page_size: pageSize })
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    const onDeleteItem = async (id?: number) => {
        if (!id) return
        const res = await LandingMapApi.deleteLandTypeChange({ id })
        return res
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <LandTypeChangeContext.Provider value={{ ...context, onDeleteItem }}>
            {children}
        </LandTypeChangeContext.Provider>
    )
})

export const useLandTypeChangeContext = () => {
    return React.useContext(LandTypeChangeContext);
}