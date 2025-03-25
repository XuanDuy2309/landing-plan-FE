import debounce from 'debounce'
import { makeAutoObservable, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SearchLandingPlanApi } from 'src/core/api'
import { IContextFilter } from 'src/core/context'
import { NominatimResult } from 'src/core/models'
import { useManagementLandingPlan } from './management-landing-plan-context'

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
        try {
            setLoading(true)
            if (!query) return
            let params = { q: query }
            const res = await SearchLandingPlanApi.searchInterval(params)
            setListResultSearch(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ListSearchBoxLandingPlanContext.Provider value={{
            filter,
            handleSearch,
            listResultSearch,
            setListResultSearch,
            loading
        }}>{children}</ListSearchBoxLandingPlanContext.Provider>
    )
})

export const useListSearchBoxLandingPlan = () => {
    return useContext(ListSearchBoxLandingPlanContext)
}
