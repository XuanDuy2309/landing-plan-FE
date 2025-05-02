import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { useRef, useState } from "react";

export class IContextFilter {
  @observable sort?: string
  @observable query?: string
  constructor() {
    makeObservable(this)
  }
}

class DataContextType<T, F> {
  data: T[] = []
  filter?: F = undefined
  indexPage: number = 1
  pageSize: number = 15
  total: number = 0
  loading?: boolean = false
  dataSelect: T[] = []
  isCreate?: boolean = false
  isImport?: boolean = false
  dataView: T[] = []
  isShowFilter: boolean = false
  isSetting: boolean = false
  itemUpdate?: T = undefined;
  openEmail: boolean = false;
  isGrid: boolean = false;
  constructor(filter?: any) {
    if (filter) {
      this.filter = filter
    }
    makeAutoObservable(this)
  }
}


export class IBaseContextType<T, F> {
  data!: T[]
  filter!: F extends IContextFilter ? F : never;
  indexPage!: number
  pageSize!: number
  total!: number
  onRefresh!: () => void
  onRefreshCurentPage!: () => void
  onPrev!: () => void
  onNext!: () => void
  onDelete?: (item?: T) => Promise<any>
  setFilter!: (value: F) => void
  setPageSize!: (value: number) => void;
  loading?: boolean
  setLoading?: (value: boolean) => void
  dataSelect!: T[]
  setDataSelect!: (value: T[]) => void
  isCreate?: boolean
  setCreate!: (value: boolean) => void
  isImport?: boolean
  setImport!: (value: boolean) => void
  dataView!: T[]
  setDataView!: (value: T[]) => void
  setShowFilter!: (value: boolean) => void
  isShowFilter!: boolean
  isSetting!: boolean
  setShowSetting!: (value: boolean) => void;
  itemUpdate?: T;
  setItemUpdate!: (value?: T) => void;
  openEmail!: boolean
  setIsOpenEmail!: (value: boolean) => void;
  isGrid?: boolean
  setGrid!: (value: boolean) => void;
  setData!: (value: T[]) => void;
  hasMore!: () => boolean
  fetchMore!: () => void
}

export const useBaseContextProvider = <ITypeFilter, T>(
  filterInit: ITypeFilter,
  request: (
    filter: ITypeFilter,
    indexPage: number,
    pageSize: number
  ) => Promise<{ count: number; list: T[]; offset: number }>,
  deleteRequest?: (dataDelete: T[]) => Promise<{ count: number; list: T[]; offset: number }>
) => {
  const [stateContext, setStateContext] = useState<DataContextType<T, ITypeFilter>>(
    new DataContextType<T, ITypeFilter>(filterInit)
  )
  const indexPageRef = useRef<number>(1)
  const pageSizeRef = useRef<number>(5)
  const totalRef = useRef<number>(0)

  const fetchInternalWithoutLoading = async () => {
    stateContext.dataSelect = []
    let res = await request(stateContext.filter!, indexPageRef.current, pageSizeRef.current)
    totalRef.current = res.count
    stateContext.data = res.list
  }

  const onRefreshCurentPage = async () => {
    fetchInternalWithoutLoading()
  }


  const hasMore = (): boolean => {
    return (
      totalRef.current > stateContext.data.length &&
      !stateContext.loading
    );
  };

  const fetchMore = async () => {
    if (stateContext.loading) return;
    stateContext.loading = true;
    indexPageRef.current += 1;
    try {
      const res = await request(stateContext.filter!, indexPageRef.current, pageSizeRef.current);
      runInAction(() => {
        stateContext.data = [...stateContext.data, ...res.list];
        totalRef.current = res.count;
      });
    } catch (error) {
      console.error("Error fetching more data: ", error);
    } finally {
      stateContext.loading = false;
    }
  };

  const fetchInternal = async () => {
    stateContext.loading = true
    runInAction(async () => {
      stateContext.dataSelect = []
      let res = await request(stateContext.filter!, indexPageRef.current, pageSizeRef.current)
      stateContext.loading = false
      totalRef.current = res.count
      stateContext.data = res.list
    })
  }

  const onRefresh = async () => {
    stateContext.data = []
    indexPageRef.current = 1
    fetchInternal()
  }

  const onPrev = async () => {
    if (indexPageRef.current === 1) return
    indexPageRef.current--;
    await fetchInternal()
  }

  const onNext = async () => {
    if (totalRef.current <= indexPageRef.current * pageSizeRef.current) return
    indexPageRef.current++
    await fetchInternal()
  }

  const onDelete = async (item?: T) => {
    if (!deleteRequest) return
    stateContext.loading = true
    stateContext.dataSelect = []
    let data: T[] = []
    if (!item) data = stateContext.dataSelect
    else data = [item]
    let res = await deleteRequest(data)
    stateContext.loading = false
    return res;
  }

  const setCreate = (value: boolean) => {
    runInAction(() => {
      stateContext.isImport = false;
      stateContext.isCreate = value;
    })
  }


  const setImport = (value: boolean) => {
    runInAction(() => {
      stateContext.isCreate = false
      stateContext.isImport = value
    })
  }

  const setFilter = (filter: ITypeFilter) => {
    stateContext.filter = filter;
  }

  const setDataView = (value: T[]) => {
    stateContext.dataView = value
  }

  const setLoading = (value: boolean) => {
    stateContext.loading = value
  }

  const setShowSetting = (value: boolean) => {
    stateContext.isSetting = value
  }

  const setIsOpenEmail = (value: boolean) => {
    stateContext.openEmail = value
  }

  const setShowFilter = (value: boolean) => {
    stateContext.isShowFilter = value
  }

  const setDataSelect = (value: T[]) => {
    stateContext.dataSelect = value
  }

  const setItemUpdate = (value?: T) => {
    stateContext.itemUpdate = value;
  }

  const setPageSize = (pageSize: number) => {
    pageSizeRef.current = pageSize
  }

  const setGrid = (value: boolean) => {
    stateContext.isGrid = value
  }

  const setData = (value: T[]) => {
    stateContext.data = value
  }

  return {
    data: stateContext.data || [],
    filter: stateContext.filter,
    indexPage: indexPageRef.current || 1,
    pageSize: pageSizeRef.current || 15,
    total: totalRef.current,
    loading: stateContext.loading,
    dataSelect: stateContext.dataSelect,
    dataView: stateContext.dataView || [],
    isCreate: stateContext.isCreate,
    isShowFilter: stateContext.isShowFilter,
    isSetting: stateContext.isSetting,
    isImport: stateContext.isImport,
    itemUpdate: stateContext.itemUpdate,
    openEmail: stateContext.openEmail,
    isGrid: stateContext.isGrid,
    onRefreshCurentPage,
    setGrid,
    setIsOpenEmail,
    onRefresh,
    onPrev,
    onNext,
    setFilter,
    setPageSize,
    onDelete,
    setDataSelect,
    setCreate,
    setDataView,
    setLoading,
    setShowFilter,
    setShowSetting,
    setImport,
    setItemUpdate,
    setData,
    hasMore,
    fetchMore
  } as IBaseContextType<T, ITypeFilter>
}
