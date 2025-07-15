import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { createContext, useContext, useEffect, useState } from "react";
import { AdminApi, AuthApi } from "src/core/api";
import { DashboardSumaryModel, UserModel } from "src/core/models";


export class DataDashboard {
    @observable loading: boolean = false;
    @observable sumary: DashboardSumaryModel = new DashboardSumaryModel()
    @observable listUsers: UserModel[] = []
    constructor() {
        makeObservable(this);
    }
}

export type DashboardContextType = {
    data: DataDashboard;
    timer?: string;
}

export const DashboardContext = createContext<DashboardContextType>(
    {
        data: new DataDashboard(),
        timer: ''
    }
)


export function useDashboardContext(): DashboardContextType {
    return useContext(DashboardContext)
}

interface Iprop {
    children?: React.ReactNode;

}

export const DashboardContextProvider = observer(({ children }: Iprop) => {
    const value = useProviderDashboardContext()

    return <DashboardContext.Provider value={value}>
        {children}
    </DashboardContext.Provider>
})

const useProviderDashboardContext = (): DashboardContextType => {
    const [data] = useState<DataDashboard>(new DataDashboard())

    const fecthDashboardSumary = async () => {
        const res = await AdminApi.getDashboardSumary({})
        if (res.Status) {
            data.sumary = res.Data.data
        }
    }

    const fecthListUsers = async () => {
        const params = {
            last_login: 1
        }
        const res = await AuthApi.getListUser(params)
        if (res.Status) {
            data.listUsers = res.Data.data
        }
    }


    // Replace the existing useEffect with this updated version:
    useEffect(() => {
        const getData = async () => {
            data.loading = true
            await Promise.all([
                fecthDashboardSumary(),
                fecthListUsers()
            ])
            data.loading = false
        }
        getData();
    }, [])


    return {
        data: data,
    }
}
