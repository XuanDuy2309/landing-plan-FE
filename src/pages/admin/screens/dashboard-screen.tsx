import { Skeleton } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { getColorFromId } from "src/core/base";
import { DashboardContextProvider, useDashboardContext } from "src/core/modules";

export const DashboardScreen = observer(() => {
    return (
        <DashboardContextProvider>
            <DashboardContainer />
        </DashboardContextProvider>
    );
});


const DashboardContainer = observer(() => {
    const { data } = useDashboardContext()
    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="mt-6 grid grid-cols-3 gap-6">
                {/* Thống kê */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Tổng số người dùng</h3>
                    {!data.loading ?
                        <p className="mt-2 text-3xl font-bold text-blue-600">{data.sumary.number_user}</p>
                        : <Skeleton.Node active style={{ width: "50px", height: "36px", borderRadius: '2px' }} />
                    }
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Bài đăng mới</h3>
                    {!data.loading ?
                        <p className="mt-2 text-3xl font-bold text-green-600">{data.sumary.number_new_post}</p>
                        : <Skeleton.Node active style={{ width: "50px", height: "36px", borderRadius: '2px' }} />
                    }
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Phiên đấu giá</h3>
                    {!data.loading ?
                        <p className="mt-2 text-3xl font-bold text-orange-600">{data.sumary.number_auction}</p>
                        : <Skeleton.Node active style={{ width: "50px", height: "36px", borderRadius: '2px' }} />
                    }
                </div>
            </div>

            {/* Danh sách hoạt động gần đây */}
            <div className="mt-8 flex-1 flex flex-col min-h-0">
                <h2 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h2>
                <div className="mt-4 space-y-4 flex flex-col overflow-y-auto w-full h-full flex-1">
                    {data.listUsers.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className='size-10 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'
                                        style={{
                                            backgroundColor: getColorFromId(item.id || 0)
                                        }}
                                    >
                                        {
                                            item.avatar ?
                                                <img src={item.avatar} alt="" className="size-full object-cover" />
                                                :
                                                <span className="text-2xl font-bold text-white">{item.fullname?.charAt(0).toUpperCase()}</span>

                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.fullname}</p>
                                        <p className="text-sm text-gray-500">{item.last_login ? dayjs(item.last_login).fromNow() : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});