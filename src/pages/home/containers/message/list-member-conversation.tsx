import { Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { getColorFromId } from "src/core/base";
import { Type_List } from "src/core/modules";
import { ListUserContextProvider, useListUserContext } from "src/core/modules/user/context";

interface IProps {
    type: Type_List
    title?: string
}

export const ListMemberConversationContainer = observer(({ type, title }: IProps) => {
    return (
        <ListUserContextProvider type={type}>
            <ListUser type={type} title={title} />
        </ListUserContextProvider>
    )
})

const ListUser = observer(({ type, title }: IProps) => {
    const { data, loading, fetchMore, hasMore, onRefresh, filter } = useListUserContext()
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div className={classNames("w-full flex flex-col transition-all ease-linear duration-500 border-b border-gray-200",
            { 'h-full': open },
            { 'h-12': !open },
        )}>
            <div className="w-full h-12 flex flex-none items-center justify-between ">
                <span className="text-lg font-medium text-gray-700">{title}</span>
                <ButtonIcon icon={open ? "arrowdown" : "arrowright"} size={'xxs'} color={Colors.gray[700]}
                    onClick={() => {
                        setOpen(!open)
                        filter.query = ''
                        onRefresh()
                    }}
                />
            </div>
            {open && <div className="w-full flex flex-col py-3 space-y-2 min-h-0 border-t border-gray-200">
                {/* <div className="w-full h-10 px-3 flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full h-full outline-none border border-gray-200 rounded-full text-base text-gray-500 py-1 px-3 focus-within:border-gray-600"
                        onChange={debounce((e) => {
                            filter.query = e.target.value
                            onRefresh()
                        }, 500)}
                    />
                </div> */}
                <div className="w-full h-full flex flex-col overflow-y-auto">
                    <div id={"list-member-" + type} className="w-full py-4 h-full flex flex-col items-center overflow-y-auto scroll-hide">
                        <InfiniteScroll
                            dataLength={data.length} //This is important field to render the next data
                            next={() => {
                                fetchMore()
                            }}
                            hasMore={hasMore()}
                            refreshFunction={onRefresh}
                            loader={<div className="w-full items-center justify-center flex">
                                <Spin />
                            </div>}
                            scrollableTarget={"list-member-" + type}
                            style={{ overflow: 'none' }}
                        >
                            <div className="w-full h-full flex flex-col">
                                {
                                    !loading && data.map((item, index) => {
                                        return (
                                            <div className={classNames("w-full py-2 px-3 flex items-center space-x-2 cursor-pointer hover:bg-gray-200 border-b border-gray-200",

                                            )}
                                                onClick={() => {
                                                }}
                                                key={index}
                                            >
                                                <div className='size-10 rounded-full flex items-center justify-center overflow-hidden '
                                                    style={{
                                                        backgroundColor: getColorFromId(item.id || 0)
                                                    }}
                                                >
                                                    {
                                                        item.avatar ?
                                                            <img src={item.avatar} alt="" className="size-full object-cover" />
                                                            :
                                                            <span className="text-2xl font-bold text-white" >{item.fullname?.charAt(0).toUpperCase()}</span>

                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-medium text-gray-700">{item.fullname}</span>
                                                    <span className="text-xs text-gray-500">{item.follower_ids?.length} người theo dõi</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </InfiniteScroll>
                    </div>
                    {
                        !loading && data.length === 0 &&
                        <div className="w-full h-10 flex items-center justify-center">
                            <span className="text-gray-500">Không tìm thấy người dùng</span>
                        </div>
                    }
                </div>
            </div>}
        </div>
    )
})