import { Dropdown, MenuProps } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { use, useEffect, useState } from "react";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { useCoreStores } from "src/core/stores";
import { DropdownSettingHeader } from "./dropdown-setting-header";
import { values } from "mobx";
import { useLocation } from "react-router-dom";

export const HeaderHome = observer(() => {
    const { sessionStore } = useCoreStores()
    const [activeScreen, setActiveScreen] = useState<number>(0)
    const [activeDropdown, setActiveDropdown] = useState<boolean>(false)
    const { pathname } = useLocation()
    const listPages = [
        {
            key: 0,
            title: 'Home',
            icon: 'home-outline',
            link: '/Home',
        },
        {
            key: 1,
            title: 'Search',
            icon: "search-outline",
            link: ''
        },
        {
            key: 2,
            title: "Profile",
            icon: "profile-outline",
            link: ''
        },
        {
            key: 3,
            title: "Group",
            icon: "group-outline",
            link: ''
        },
        {
            key: 4,
            title: 'Messages',
            icon: "messenger-outline",
            link: ''
        }
    ]

    useEffect(() => {
        setActiveScreen(listPages.findIndex(item => item.link === pathname) || -1)
    }, [pathname])

    return (
        <div className="w-full h-14 flex items-center justify-center border-b border-gray-300 bg-white shadow">
            <div className="w-full max-w-[1240px] h-full flex items-center justify-between  ">
                <span className="cursor-pointer text-3xl font-bold text-blue-400 w-[240px] flex-none">LANDING PLAN</span>
                <div className="h-full flex items-center justify-center space-x-2">
                    {
                        listPages.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames("w-[100px] h-13 flex flex-col items-center justify-center space-y-0.5 cursor-pointer  text-[14px] font-medium",
                                        { 'text-blue-600 border-b-2 border-blue-600': activeScreen === item.key },
                                        { 'text-white rounded hover:bg-gray-200': activeScreen !== item.key }
                                    )}
                                    onClick={(e) => {
                                        setActiveScreen(item.key)
                                    }}
                                >
                                    <IconBase icon={item.icon} size={24} color={activeScreen === item.key ? Colors.blue[400] : Colors.gray[700]} />
                                    {/* <span className="">{item.title}</span> */}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="w-[240px] flex items-center justify-end space-x-2 flex-none h-full">
                    <div className="size-10 rounded-full flex flex-col items-center justify-center space-y-1 cursor-pointer hover:bg-gray-300 bg-gray-200">
                        <IconBase icon="notification-outline" size={28} color={Colors.gray[700]} />
                    </div>
                    <Dropdown
                        open={activeDropdown}
                        trigger={['click']}
                        dropdownRender={() => <DropdownSettingHeader onSelect={() => { setActiveDropdown(!activeDropdown) }} />}
                        onOpenChange={(value) => setActiveDropdown(value)}
                    >
                        <div className="size-12 relative flex items-center justify-center hover:opacity-70">
                            <div className='size-10 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'>
                                {
                                    sessionStore.profile && sessionStore.profile?.avatar ?
                                        <img src={sessionStore.profile.avatar} alt="" className="size-full object-cover" />
                                        :
                                        <span className="text-2xl font-bold text-gray-900">{sessionStore.profile?.fullname?.charAt(0).toUpperCase()}</span>

                                }
                            </div>
                            <div className="size-5  absolute bottom-0 right-0 rounded-full flex items-center justify-center bg-gray-700">
                                <IconBase icon='arrowdown' size={16} color={Colors.white} />
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div >
    )
})