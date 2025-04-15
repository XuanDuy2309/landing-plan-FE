import { Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { use, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DistrictProvider, ProvinceProvider, WardProvider } from "src/core/modules/location";

interface IProps {
    id:number
    onChange?: (value) => void
}

export const ListWard = observer(({id, onChange }: IProps) => {
    const provider = useMemo(() => {
        const provider = new WardProvider();
        provider.id=id
        provider.pageSize=15
        return provider
    }, [])


    useEffect(() => {
        provider.refreshData();
    }, [id])
    return (
        <div id={'ward'} className='flex flex-col w-full h-[290px] overflow-y-auto'>
            {provider.data.length > 0 && (
                <InfiniteScroll
                    dataLength={provider.data.length}
                    next={() => {
                        provider.fetchMore();
                    }}
                    scrollThreshold={-50}
                    hasMore={provider.hasMore}
                    loader={
                        <div className='w-full items-center justify-center flex'>
                            <Spin />
                        </div>
                    }
                    scrollableTarget='ward'
                >
                    {provider.data.map((item: any, index) => (
                        <button
                            onClick={() => onChange && onChange(item)}
                            key={index}
                            className='text-ellipsis overflow-hidden w-full flex flex-row hover:bg-gray-100 border-b-[1px] border-gray-100'
                        >
                            <div className='flex h-10 px-3 py-2.5 items-center text-gray-700 text-base'>
                                <span>{item.name}</span>
                            </div>
                        </button>
                    ))}
                </InfiniteScroll>
            )}
            {provider.isFetchData && (
                <div
                    className={classNames('w-full items-center justify-center flex ', {
                        'h-[300px]': provider.data.length === 0,
                    })}
                >
                    <Spin />
                </div>
            )}
            {!provider.isFetchData && provider.data.length === 0 && (
                <div className='w-full h-full flex justify-center items-center'>
                    <span>{"Không có dữ liệu"}</span>
                </div>
            )}
        </div>
    )
})