import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { LandingMapApi } from "src/core/api";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "../../../context";
import { LandingPlanModel, Purpose_Post } from "../../../models";


export class FilterMapContextType extends IContextFilter {

    constructor() {
        super();
        makeObservable(this)
    }
}

export class MapContextType extends IBaseContextType<LandingPlanModel, FilterMapContextType> {
}

export const MapContext = React.createContext<MapContextType>(new MapContextType());

interface IProps {
    children: React.ReactNode
    id?: number
    following?: boolean
    purpose?: Purpose_Post
}

export const MapContextProvider = observer(({ children, id, following, purpose }: IProps) => {
    const context = useBaseContextProvider<FilterMapContextType, LandingPlanModel>(new FilterMapContextType(), request)


    async function request(
        filter: FilterMapContextType,
        index: number,
        pageSize: number
    ): Promise<{ count: number; list: LandingPlanModel[]; offset: number }> {
        const res = await LandingMapApi.getListMaps({ ...filter, page: index, page_size: pageSize })
        return {
            list: res.Data?.data,
            count: res.Data?.total,
            offset: 0
        }
    }

    useEffect(() => {
        context.onRefresh()
    }, [])

    return (
        <MapContext.Provider value={{ ...context }}>
            {children}
        </MapContext.Provider>
    )
})

export const useMapContext = () => {
    return React.useContext(MapContext);
}