import { Dropdown, MenuProps, Spin } from "antd";
import classNames from "classnames";
import debounce from "debounce";
import { observer } from "mobx-react";
import { useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Colors } from "src/assets";
import { ModalBase } from "src/components";
import { ButtonIcon } from "src/components/button-icon";
import { ModalConfirm } from "src/components/modal-confirm/modal-confim";
import { getColorFromId } from "src/core/base";
import { useSocketEvent } from "src/core/hook";
import { MessageModel, MessageType, Role, Type_Conversation, UserModel } from "src/core/models";
import { Type_List, useDetailConversationContext } from "src/core/modules";
import { ListUserContextProvider, useListUserContext } from "src/core/modules/user/context";
import { useCoreStores } from "src/core/stores";
import { ModalChangeNickname } from "./modal-change-nickname";

interface IProps {
    id?: number
    type: Type_List
    title?: string
}

export const ListMemberConversationContainer = observer(({ id, type, title }: IProps) => {
    return (
        <ListUserContextProvider type={type} id={id}>
            <ListUser type={type} title={title} />
        </ListUserContextProvider>
    )
})

const ListUser = observer(({ type, title }: IProps) => {
    const { data, loading, fetchMore, hasMore, onRefresh, filter } = useListUserContext()
    const { data: dataConversation, setIsMute, setIsAdmin, fecthData } = useDetailConversationContext()
    const [open, setOpen] = useState<boolean>(false)
    const { sessionStore } = useCoreStores()

    useSocketEvent<MessageModel>('new_message', (mess) => {
        if (mess.conversation_id === dataConversation.id && mess.type === MessageType.SYSTEM) {
            onRefresh()
        }
    })

    

    return (
        <div className={classNames("w-full flex flex-col min-h-0 transition-all ease-linear duration-500 border-b border-gray-200",
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
                {dataConversation.type === Type_Conversation.Group && <div className="w-full h-10 flex items-center space-x-2 rounded border border-gray-200">
                    <ButtonIcon icon="search-outline" iconSize="24" color={Colors.gray[500]} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full h-full outline-none text-base text-gray-500 py-1 focus-within:border-gray-600"
                        onChange={debounce((e) => {
                            filter.query = e.target.value
                            onRefresh()
                        }, 500)}
                    />
                </div>}
                <div className="w-full h-full flex flex-col overflow-y-auto">
                    <div id={"list_member_" + type} className="w-full py-4 h-full flex flex-col items-center overflow-y-auto scroll-hide">
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
                            scrollableTarget={"list_member_" + type}
                            style={{ overflow: 'none' }}
                        >
                            <div className="w-full h-full flex flex-col">
                                {
                                    !loading && data.map((item, index) => {
                                        return (
                                            <ItemMember key={index} item={item} />
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

interface IPropsV2 {
    item: UserModel
}

const ItemMember = observer(({ item }: IPropsV2) => {
    const { data: dataConversation, setIsMute, setIsAdmin, isAdmin, onUpdateNickname, onUpdateRole, onDeleteMember, fecthData } = useDetailConversationContext()
    const { onRefresh } = useListUserContext()
    const { sessionStore } = useCoreStores()
    const nicknameRef = useRef<any>(null)
    const modalConfirmRef = useRef<any>(null);

    const { isNotSelf } = useMemo(() => {
        const isNotSelf = item.id !== sessionStore.profile?.id;
        return { isNotSelf }
    }, [item.id]);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Trang cá nhân',
            onClick: () => {
                window.open(`/home/profile/${item.id}`, '_blank');
            },
        },
        {
            key: '3',
            label: 'Đổi biệt hiệu',
            onClick: () => {
                nicknameRef.current?.open();
            },
        },
        ...(dataConversation.type === Type_Conversation.Group && isAdmin && isNotSelf && item.role !== Role.admin
            ? [
                {
                    key: '2',
                    label: 'Thăng cấp thành quản trị viên',
                    onClick: async () => {
                        const res = await onUpdateRole(item);
                        if (res.Status) {
                            item.role = Role.admin;
                        }
                    },
                },

                {
                    key: '4',
                    label: 'Xoá khỏi nhóm',
                    onClick: () => {
                        modalConfirmRef.current?.open();
                    },
                    danger: true,
                },
            ]
            : []),
    ];
    return (
        <div className={classNames("w-full py-2 px-3 flex items-center space-x-2 cursor-pointer hover:bg-gray-200 border-b border-gray-200",

        )}
            onClick={() => {
            }}
        >
            <div className="size-10 relative flex items-center justify-center">
                <div className='size-10 flex-none rounded-full flex items-center justify-center overflow-hidden'
                    style={{
                        backgroundColor: item.avatar ? undefined : getColorFromId(item.id || 0)
                    }}
                >
                    {
                        item.avatar ?
                            <img src={item.avatar} alt="" className="size-full  object-cover" />
                            :
                            <span className="text-2xl font-bold text-white" >{item.fullname?.charAt(0).toUpperCase()}</span>

                    }

                </div>
                <div className={classNames("size-3 rounded-full absolute bottom-0 right-0 ",
                    {
                        'bg-green-500': item.is_online === 1,
                        'bg-gray-400': item.is_online === 0,
                    }
                )}></div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-lg font-medium text-gray-700">{item.nickname || item.fullname}</span>
                {dataConversation.type === Type_Conversation.Group && <span className="text-xs text-gray-500">{item.role === 'admin' ? 'Quản trị viện' : 'Thành viên'}</span>}
                {dataConversation.type === Type_Conversation.Direct && <span className="text-xs text-gray-500">{item.fullname}</span>}
            </div>
            <Dropdown trigger={["click"]} menu={{ items }}>
                <div><ButtonIcon icon="more-2" size={'xxs'} color={Colors.gray[700]} /></div>
            </Dropdown>
            <ModalBase ref={nicknameRef} destroyOnClose>
                <ModalChangeNickname
                    item={item}
                    onSave={async () => {
                        nicknameRef.current?.close()
                        await onUpdateNickname(item);

                    }} onClose={() => {
                        nicknameRef.current?.close()
                    }} />
            </ModalBase>
            <ModalConfirm
                ref={modalConfirmRef}
                label={`Bạn có chắc chắn muốn xoá ${item.fullname} khỏi nhóm không?`}
                onConfirm={async () => {
                    modalConfirmRef.current?.close();
                    const res = await onDeleteMember(item);
                    if (res.Status) {
                        onRefresh();
                        fecthData();
                        return;
                    }
                }
                }
                onCancel={() => {
                    modalConfirmRef.current?.close();
                }}
            />
        </div>
    )
})