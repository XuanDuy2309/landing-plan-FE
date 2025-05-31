import { Spin } from "antd"
import classNames from "classnames"
import dayjs from "dayjs"
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from "debounce"
import { observer } from "mobx-react"
import moment from "moment"
import 'moment/locale/vi'; // import ngôn ngữ tiếng Việt
import { useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Colors } from "src/assets"
import { IconBase, ModalBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId } from "src/core/base"
import { useSocketEvent } from "src/core/hook"
import { ConversationModel, MessageModel, MessageType, Type_Conversation } from "src/core/models"
import { ListConversationContextProvider, useListConversationContext, useManagerConversationContext } from "src/core/modules"
import { useCoreStores } from "src/core/stores"
import { ModalCreateConversation } from "./modal-create-conversation-container"

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
    const { sessionStore } = useCoreStores()

    useEffect(() => {
        if (data.length > 0) {
            const messCount = data.reduce((total: number, item: any) => {
                return total + item.unread_count
            }, 0)
            sessionStore.setNewMessageCount(messCount)
        }
    }, [JSON.stringify(data)])

    useSocketEvent('notification_message', (dataMess: MessageModel) => {
        data.forEach((item: ConversationModel) => {
            if (item.id === dataMess.conversation_id) {
                console.log(item.unread_count)
                item.unread_count = item.unread_count + 1
                item.last_message = new MessageModel()
                item.last_message.sender_name = dataMess?.sender_name || ""
                item.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
                item.last_message.content = dataMess?.content
                if (dataMess?.type === MessageType.IMAGE) {
                    item.last_message.content = 'Hình ảnh'
                }
                if (dataMess?.type === MessageType.FILE) {
                    item.last_message.content = 'file'
                }
            }
        })
    })

    useSocketEvent('new_message', (dataMess: any) => {
        data.forEach((item: ConversationModel) => {
            if (item.id === dataMess.conversation_id) {
                item.last_message = new MessageModel()
                item.last_message.sender_name = dataMess.sender_name
                item.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
                item.last_message.content = dataMess.content
                if (dataMess.type === MessageType.IMAGE) {
                    item.last_message.content = 'Hình ảnh'
                }
                if (dataMess.type === MessageType.FILE) {
                    item.last_message.content = 'file'
                }
            }
        })
    })

    useSocketEvent('message_edited', (mess: MessageModel) => {
        data.forEach((item, index) => {
            if (item.id === mess.conversation_id) {
                item.last_message.content = mess.content
                item.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
                item.last_message.sender_name = mess.sender_name
            }
        })
    })

    useSocketEvent('message_deleted', (mess) => {
        data.forEach((item, index) => {
            if (item.id === mess.conversation_id) {
                item.last_message.content = mess.content
                item.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
                item.last_message.sender_name = mess.sender_name
            }
        })
    })

    useSocketEvent('conversation_created', (conversation: ConversationModel) => {
        const newConversation = new ConversationModel()
        Object.assign(newConversation, conversation)
        data.unshift(newConversation)
    })

    useSocketEvent('conversation_updated', (conversation: ConversationModel) => {
        const newConversation = new ConversationModel()
        Object.assign(newConversation, conversation)
        data.forEach((item, index) => {
            if (item.id === newConversation.id) {
                data[index] = newConversation
            }
        })
    })

    const renderAvatar = (item: ConversationModel) => {
        if (!item.id) return null;

        const isDirect = item.type === Type_Conversation.Direct;
        const targetMember = isDirect
            ? item.members.find(m => m.id !== sessionStore.profile?.id)
            : undefined;

        const avatarUrl = isDirect
            ? targetMember?.avatar
            : item.avatar;

        const displayChar = isDirect
            ? (targetMember?.fullname?.charAt(0).toUpperCase() || '?')
            : (item.name?.charAt(0).toUpperCase() || '?');

        const bgColor = getColorFromId(
            isDirect ? targetMember?.id || 0 : item.id || 0
        );

        return (
            <div className="size-10 flex-none rounded-full overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: bgColor }}
                    >
                        <span className="text-lg font-bold text-white">{displayChar}</span>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className={classNames("w-full flex flex-col transition-all ease-linear duration-500 border-gray-200"
        )}>
            <div className="w-full h-12 flex flex-none items-center justify-between px-3 ">
                <span className="text-lg font-medium text-gray-700">{"Tin nhắn"}</span>
                <ButtonIcon icon="addnewchat-outline" size={'xxs'} color={Colors.gray[700]} onClick={() => {
                    modalRef.current?.open()
                }} />
            </div><div className="w-full flex flex-col py-3 space-y-2 min-h-0 border-t border-gray-200">
                <div className="px-3">
                    <div className="w-full h-10 px-3 flex items-center space-x-2 flex-none border border-gray-200 rounded">
                        <IconBase icon="search-outline" size={20} color={Colors.gray[700]} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="w-full h-full outline-none  text-base text-gray-500 py-1 px-3 focus-within:border-gray-600"
                            onChange={debounce((e) => {
                                filter.query = e.target.value
                                onRefresh()
                            }, 500)}
                        />
                    </div>
                </div>
                <div className="w-full h-full flex flex-col overflow-y-auto">
                    <div id={"list_conversation"} className="w-full py-4 h-full flex flex-col items-center overflow-y-auto scroll-hide">
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
                            scrollableTarget={"list_conversation"}
                            style={{ overflow: 'none' }}
                        >
                            <div className="w-full h-full flex flex-col px-2 rounded">
                                {
                                    !loading && [...data].sort((a: ConversationModel, b: ConversationModel) => {
                                        const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
                                        const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
                                        return bTime - aTime;
                                    }).map((item, index) => {
                                        return (
                                            <div className={classNames("w-full py-2 px-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-200 border-gray-200",
                                                { "bg-blue-50": selectedId === item.id }
                                            )}
                                                onClick={() => {
                                                    setSelectedId(item.id || 0)
                                                    item.unread_count = 0
                                                    sessionStore.setNewMessageCount(sessionStore.new_message_count - item.unread_count)
                                                }}
                                                key={index}
                                            >
                                                {
                                                    renderAvatar(item)
                                                }

                                                <div className="flex flex-col w-full relative">
                                                    <span className="text-lg font-medium text-gray-700 line-clamp-1 max-w-[260px] leading-[24px]">
                                                        {item.type === Type_Conversation.Direct ? item.members.filter((i) => i.id !== sessionStore.profile?.id)[0].fullname : item.name}
                                                    </span>
                                                    <div className="w-full flex items-center justify-between max-w-[260px]">
                                                        {item.last_message && <span className="text-xs text-gray-500 line-clamp-1">{item.last_message.sender_name}: {item.last_message.content}</span>}
                                                        <span className="flex-none text-gray-500">{item.updated_at ? dayjs(item.updated_at).fromNow() : ''}</span>
                                                    </div>
                                                    {
                                                        item.unread_count > 0 &&
                                                        <div className="w-5 h-5 flex items-center justify-center absolute top-0 right-0 bg-red-500 rounded-full">
                                                            <span className="text-white text-xs font-bold">{item.unread_count}</span>
                                                        </div>
                                                    }
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
            <ModalBase ref={modalRef} destroyOnClose>
                <ModalCreateConversation
                    onSave={() => {
                        modalRef.current?.close()
                    }} onClose={() => {
                        modalRef.current?.close()
                    }} />
            </ModalBase>
        </div>
    )
})