import { Spin } from "antd"
import classNames from "classnames"
import debounce from "debounce"
import { observer } from "mobx-react"
import moment from "moment"
import { useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Colors } from "src/assets"
import { ModalBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId } from "src/core/base"
import { ListConversationContextProvider, useListConversationContext, useManagerConversationContext } from "src/core/modules"
import { ModalCreateConversation } from "./modal-create-conversation-container"

export const ListConversationContainer = observer(() => {
    return (
        <div className="w-[360px] h-full flex flex-col bg-white shadow border-r border-gray-300 flex-none overflow-y-auto">
            <ListConversationContextProvider>
                <ListConversation />
            </ListConversationContextProvider>
        </div>
    )
})

export const ListConversation = observer(() => {
    const { data, loading, filter, onRefresh, fetchMore, hasMore } = useListConversationContext()
    const { selectedId, setSelectedId } = useManagerConversationContext()
    const modalRef = useRef<any>(null)
    return (
        <div className={classNames("w-full flex flex-col transition-all ease-linear duration-500 border-gray-200"
        )}>
            <div className="w-full h-12 flex flex-none items-center justify-between px-3 ">
                <span className="text-lg font-medium text-gray-700">{"Tin nhắn"}</span>
                <ButtonIcon icon="addnewchat-outline" size={'xxs'} color={Colors.gray[700]} onClick={() => {
                    modalRef.current?.open()
                }} />
            </div><div className="w-full flex flex-col py-3 space-y-2 min-h-0 border-t border-gray-200">
                <div className="w-full h-10 px-3 flex items-center space-x-2 flex-none">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full h-full outline-none border border-gray-200 rounded-full text-base text-gray-500 py-1 px-3 focus-within:border-gray-600"
                        onChange={debounce((e) => {
                            filter.query = e.target.value
                            onRefresh()
                        }, 500)}
                    />
                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                    <div id={"list-mess"} className="w-full py-4 h-full flex flex-col items-center overflow-y-auto scroll-hide">
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
                            scrollableTarget={"list-mess"}
                            style={{ overflow: 'none' }}
                        >
                            <div className="w-full h-full flex flex-col px-2 rounded">
                                {
                                    !loading && data.map((item, index) => {
                                        return (
                                            <div className={classNames("w-full py-2 px-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-200 border-gray-200",
                                                { "bg-blue-50": selectedId === item.id }
                                            )}
                                                onClick={() => {
                                                    setSelectedId(item.id || 0)
                                                }}
                                                key={index}
                                            >
                                                <div className='size-10 flex-none rounded-full flex items-center justify-center overflow-hidden '
                                                    style={{
                                                        backgroundColor: getColorFromId(item.id || 0)
                                                    }}
                                                >

                                                    <span className="text-2xl font-bold text-white" >{item.name?.charAt(0).toUpperCase()}</span>


                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-medium text-gray-700 line-clamp-1 leading-[24px]">{item.name}</span>
                                                    <div className=" flex items-center">
                                                        {/* {item.last_message && <span className="text-xs text-gray-500 line-clamp-1">{item.last_message.sender_name}: {item.last_message.content}</span>} */}
                                                        <span className="flex-none text-gray-500">{item.updated_at ? moment(item.updated_at).fromNow() : ''}</span>
                                                    </div>
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
                            <span className="text-gray-500">Không tìm thấy đoạn chat nào</span>
                        </div>
                    }
                </div>
            </div>
            <ModalBase ref={modalRef}>
                <ModalCreateConversation onSave={() => {
                    modalRef.current?.close()
                    onRefresh()
                }} onClose={() => {
                    modalRef.current?.close()
                }} />
            </ModalBase>
        </div>
    )
})