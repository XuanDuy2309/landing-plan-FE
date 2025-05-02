import { Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { NotificationModel, useNotificationStore } from "src/core/context";
import { useCoreStores } from "src/core/stores";

interface IProps {
    onSelect?: (item?: NotificationModel) => void
}

export const DropdownNotification = observer(({ onSelect }: IProps) => {
    const { sessionStore } = useCoreStores();
    const navigate = useNavigate();
    const { data, fetchMore, hasMore, loading, onReadAllNotification, onReadNotification, onRefresh } = useNotificationStore()

    return (<div className="w-[360px] h-[290px] flex  flex-col bg-white shadow-md">
        <div id={'notification'} className='flex flex-col w-full h-full  justify-between overflow-y-auto '>
            {data.length > 0 && (
                <InfiniteScroll
                    dataLength={data.length}
                    next={() => {
                        console.log('next')
                        fetchMore();
                    }}
                    scrollThreshold={-50}
                    hasMore={hasMore()}
                    loader={
                        <div className='w-full items-center justify-center flex'>
                            <Spin />
                        </div>
                    }
                    scrollableTarget='notification'
                    className="w-full h-full"
                >
                    {data.map((item: any, index) => (
                        <button
                            onClick={async () => {
                                const res = await onReadNotification(item.id)
                                if (res.Status) {
                                    onSelect && onSelect(item)
                                    onRefresh()
                                }
                            }}
                            key={index}
                            className={classNames('text-ellipsis overflow-hidden w-full flex flex-row hover:bg-gray-100 border-b-[1px] border-gray-100',
                                { 'bg-gray-100': item.is_read === 0 },
                                { 'bg-white': item.is_read === 1 },
                            )}
                        >
                            <div className='flex items-start py-2 px-3 space-x-2'>
                                <div className='size-10 flex-none rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'>
                                    {
                                        item.sender_avatar ?
                                            <img src={item.sender_avatar} alt="" className="size-full object-cover" />
                                            :
                                            <span className="text-2xl ro font-bold text-gray-900">{sessionStore.profile?.fullname?.charAt(0).toUpperCase()}</span>

                                    }
                                </div>
                                <div className="w-full flex flex-col items-start text-start">
                                    <span className="text-base font-medium text-gray-900">{item.message}</span>
                                    <span>{item.created_at ? moment(item.created_at).format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </InfiniteScroll>
            )}
            {loading && (
                <div
                    className={classNames('w-full items-center justify-center flex ', {
                        'h-[300px]': data.length === 0,
                    })}
                >
                    <Spin />
                </div>
            )}
            {!loading && data.length === 0 && (
                <div className='w-full h-full flex justify-center items-center'>
                    <span>{"Không có dữ liệu"}</span>
                </div>
            )}
        </div>
        {data.length > 0 && (
            <div className='w-full flex items-center justify-center py-2 border-t-[1px] border-gray-100'>
                <button
                    onClick={async () => {
                        const res = await onReadAllNotification()
                        if (res.Status) {
                            onRefresh()
                        }
                    }}
                    className='text-blue-600 font-medium'
                >
                    Xem tất cả
                </button>
            </div>
        )}
    </div>)
});