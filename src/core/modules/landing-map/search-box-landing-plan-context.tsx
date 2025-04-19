import debounce from 'debounce'
import { makeAutoObservable, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SearchLandingPlanApi } from 'src/core/api'
import { IContextFilter } from 'src/core/context'
import { NominatimResult } from 'src/core/models'
import { useManagementLandingPlan } from './management-landing-plan-context'
import { viet_map_server } from 'src/core/config'

export class FilterSearchBoxLandingPlanContextType {
    query?: string
    constructor() {
        makeAutoObservable(this)
    }
}

export class ListSearchBoxLandingPlanContextType {
    filter: FilterSearchBoxLandingPlanContextType = new FilterSearchBoxLandingPlanContextType()
    handleSearch!: (query) => void
    listResultSearch: NominatimResult[] = []
    setListResultSearch!: (listResultSearch: NominatimResult[]) => void
    loading: boolean = false
    handleReverseVietMap!: (placeId: string) => Promise<any>
}
export const ListSearchBoxLandingPlanContext = createContext<ListSearchBoxLandingPlanContextType>(
    new ListSearchBoxLandingPlanContextType()
)

interface IProps {
    children: React.ReactNode
}

export const ListSearchBoxLandingPlanProvider = observer(({ children }: IProps) => {
    const [filter, setFilter] = useState<FilterSearchBoxLandingPlanContextType>(new FilterSearchBoxLandingPlanContextType())
    const [listResultSearch, setListResultSearch] = useState<NominatimResult[]>([])
    const { setPlacement, placement } = useManagementLandingPlan()
    const [loading, setLoading] = useState<boolean>(false)
    const handleSearch = async (query) => {
        setLoading(true)
        if (!query) return
        let params = { q: query }
        try {
            const res = await viet_map_server.get("/autocomplete/v3", { text: query })
            // if (res.Data.length > 0) {
            //     const temp: NominatimResult[] = []
            //     res.Data.forEach(item => {
            //         temp.push({ display_name: item.address, isVietMapSearch: true, place_id: item.ref_id })
            //     })
            //     setListResultSearch(temp)
            //     return
            // }
            const resV2 = await SearchLandingPlanApi.searchInterval(params)
            setListResultSearch(resV2.data)
        } catch (error) {
            const resV2 = await SearchLandingPlanApi.searchInterval(params)
            setListResultSearch(resV2.data)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleReverseVietMapApi = async (place_id) => {
        try {
            const res = await viet_map_server.get("/place/v3", { refid: place_id })
            if (res.Data.length > 0) {
                const temp = new NominatimResult()
                temp.lat = res.Data.lat
                temp.lon = res.Data.lon
                temp.display_name = res.Data.display
                setPlacement(temp)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ListSearchBoxLandingPlanContext.Provider value={{
            filter,
            handleSearch,
            listResultSearch,
            setListResultSearch,
            loading,
            handleReverseVietMap: handleReverseVietMapApi
        }}>{children}</ListSearchBoxLandingPlanContext.Provider>
    )
})

export const useListSearchBoxLandingPlan = () => {
    return useContext(ListSearchBoxLandingPlanContext)
}
