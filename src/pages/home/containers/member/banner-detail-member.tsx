import { Spin } from "antd";
import { observer } from "mobx-react";
import { getColorFromId } from "src/core/base";
import { useDetailMemberContext } from "src/core/modules";

export const BannerDetailMember = observer(() => {
    const { data, loading } = useDetailMemberContext();
    return (
        <div className="w-full flex justify-center bg-white">
            <div className="w-full h-[320px] bg-linear-to-b rounded-md from-white to-gray-500 relative max-w-[1240px] bg-white">
                {data.background && <img src={data.background} alt="" className="w-full h-full object-cover" />}
                <div className="absolute bottom-0 left-0 right-0 w-full h-10 flex items-end justify-between p-3">
                    <div className="size-[120px] relative flex items-center justify-center bg-white rounded-full">

                        <div className='size-[110px] rounded-full flex items-center bg-gray-200 hover:opacity-70 justify-center overflow-hidden'
                            style={{
                                backgroundColor: getColorFromId(data.id || 0)
                            }}
                        >
                            {
                                loading ?
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Spin />
                                    </div>
                                    : (data && data?.avatar ?
                                        <img src={data.avatar} alt="" className="size-full object-cover" />
                                        :
                                        <span className="text-7xl font-bold text-white">{data?.fullname?.charAt(0).toUpperCase()}</span>)

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
})