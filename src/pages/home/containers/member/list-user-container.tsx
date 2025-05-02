import { Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { Collapse } from 'react-collapse';
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { getColorFromId } from "src/core/base";
import { Type_List, useManagerMemberContext } from "src/core/modules";
import { ListUserContextProvider, useListUserContext } from "src/core/modules/user/context";

export const ListUserContainer = observer(() => {
    const { selectedId } = useManagerMemberContext()
    return (
        <ListUserContextProvider id={selectedId}>
            <ListUser />
        </ListUserContextProvider>
    )
})

const ListUser = observer(() => {
    const { selectedList, setSelectedId, selectedId } = useManagerMemberContext()
    const { data, loading } = useListUserContext()
    return (
        <div className="w-full flex flex-col">
            <div className="w-full h-12 flex flex-none items-center justify-between px-3 border-b border-gray-200">
                <span className="text-lg font-medium text-gray-700">Danh sách người dùng</span>
                <ButtonIcon icon={selectedList === Type_List.User ? "arrowdown" : "arrowledft"} size={'xxs'} color={Colors.gray[700]} />
            </div>
            <Collapse isOpened={selectedList === Type_List.User}>
                <div className="w-full h-full flex flex-col py-3 space-y-2">
                    <div className="w-full h-10 px-3 flex items-center space-x-2">
                        <input type="text" placeholder="Tìm kiếm" className="w-full h-full outline-none border border-gray-200 rounded-full text-base text-gray-500 py-1 px-3 focus-within:border-gray-600" />
                    </div>
                    <div className="w-full h-full flex flex-col divide-y divide-gray-200">
                        {
                            !loading && data.map((item, index) => {
                                return (
                                    <div className={classNames("w-full py-2 px-3 flex items-center space-x-2 cursor-pointer hover:bg-gray-200",
                                        { "bg-gray-200": selectedId === item.id }
                                    )}
                                        onClick={() => {
                                            setSelectedId(item.id || 0)
                                        }}
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
                                        <span className="text-lg font-medium text-gray-700">{item.fullname}</span>
                                    </div>
                                )
                            })
                        }

                        {
                            loading &&
                            <div className="w-full h-10 flex items-center justify-center">
                                <Spin />
                            </div>
                        }
                        {
                            !loading && data.length === 0 &&
                            <div className="w-full h-10 flex items-center justify-center">
                                <span className="text-gray-500">Không tìm thấy người dùng</span>
                            </div>
                        }
                    </div>
                </div>
            </Collapse>
        </div>
    )
})