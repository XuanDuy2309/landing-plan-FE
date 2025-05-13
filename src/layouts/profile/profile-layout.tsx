import classNames from "classnames";
import { observer } from "mobx-react";
import moment from "moment";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "src/core/modules";
import { BannerSettingInfo } from "src/pages/settings/containers/settings-info/banner-setting-info";

export const ProfileLayout = observer(() => {
    const [activeTab, setActiveTab] = useState(0);
    const { data } = useUserContext();
    const navigate = useNavigate();
    const dataTabs = [
        {
            label: "Bài viết",
            link: '/home/profile/my_post'
        },
        {
            label: "Hình ảnh",
            link: '/home/profile/image'
        },
        {
            label: "Bài viết đã tương tác",
            link: '/home/profile/folowing_post'
        },
        {
            label: "Đang theo dõi",
            link: '/home/profile/following'

        },
        {
            label: "Người theo dõi",
            link: '/home/profile/follower'

        }
    ]
    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-y-auto">

            <BannerSettingInfo />
            <div className="w-full flex justify-center bg-white">
                <div className="w-full p-3 bg-white border-b border-gray-200 flex flex-col space-x-1 max-w-[1240px]">
                    <span className="text-2xl font-medium text-gray-700">{data.fullname}</span>
                    <span>{data.dob ? moment(data.dob).format('DD/MM/YYYY') : '--/--/----'}</span>
                </div>
            </div>
            <div className="w-full flex justify-center bg-white  sticky top-0 z-10">
                <div className="w-full flex items-center justify-start space-x-3 max-w-[1240px] px-3">
                    {dataTabs.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={classNames("px-4 h-13 flex flex-col items-center justify-center space-y-0.5 cursor-pointer text-[14px] font-medium",
                                    { 'text-blue-600 border-b-2 border-blue-600': activeTab === index },
                                    { 'text-gray-600 rounded hover:bg-gray-200': activeTab !== index }
                                )}
                                onClick={(e) => {
                                    setActiveTab(index);
                                    navigate(item.link, { replace: true });
                                }}
                            >
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full h-full flex flex-col">
                <Outlet />
            </div>
        </div>
    );
});