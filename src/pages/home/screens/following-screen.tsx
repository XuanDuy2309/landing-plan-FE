import { Spin } from "antd"
import { observer } from "mobx-react"
import { useNavigate } from "react-router-dom"
import { getColorFromId } from "src/core/base"
import { Type_List } from "src/core/modules"
import { ListUserContextProvider, useListUserContext } from "src/core/modules/user/context"

interface IProps {
    id?: number
    type?: Type_List
}

export const FollowingScreen = ({ id, type }: IProps) => {
    return (
        <ListUserContextProvider type={type} id={id}>
            <FollowingContainer />
        </ListUserContextProvider>
    )
}

const FollowingContainer = observer(() => {
    const { data, loading } = useListUserContext()
    const navigate = useNavigate()
    return (
        <div className="w-full h-full p-3 flex flex-col min-h-0 space-y-3">
            <span className="text-2xl font-bold text-gray-700">Đang theo dõi</span>
            {!loading && data.length > 0 && <div className="w-full h-full grid grid-cols-4 gap-3 overflow-y-auto scroll-hide">
                {
                    data.map((item: any, index: number) => {
                        return (
                            <div className="w-full h-[264px] flex flex-col flex-none bg-white rounded cursor-pointer hover:shadow-md overflow-hidden" key={index}
                                onClick={() => { navigate(`/home/profile/${item.id}`) }}
                            >
                                {
                                    item.avatar ?
                                        <div className="w-ful h-[200px] flex items-center justify-center">
                                            <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        :
                                        <div className="w-ful h-[200px] flex items-center justify-center"
                                            style={{
                                                backgroundColor: getColorFromId(item.id || 0)
                                            }}
                                        >
                                            <span className="text-2xl font-bold text-white">{item.fullname?.charAt(0).toUpperCase()}</span>
                                        </div>
                                }
                                <div className="w-full h-[64px] flex flex-none justify-center px-2 flex-col">
                                    <span className="text-lg font-medium text-gray-900">{item.fullname}</span>
                                    <span>{item.follower_ids ? item.follower_ids.length : 0} Người theo dõi</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>}
            {
                loading && <div className="w-full h-full flex items-center justify-center">
                    <Spin />
                </div>
            }
            {
                data.length === 0 && !loading && <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">Chưa theo dõi người nào</span>
                </div>
            }
        </div>
    )
})