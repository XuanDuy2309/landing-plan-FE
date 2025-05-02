import { Dropdown } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { NotificationModel, NotificationType, useNotificationStore } from "src/core/context";
import { useSocketEvent } from "src/core/hook";
import { useCoreStores } from "src/core/stores";
import { DropdownNotification } from "./dropdown-notification";
import { DropdownSettingHeader } from "./dropdown-setting-header";

export const HeaderHome = observer(() => {
    const { sessionStore } = useCoreStores()
    const [activeScreen, setActiveScreen] = useState<number>(0)
    const [activeDropdown, setActiveDropdown] = useState<boolean>(false)
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { data, onRefresh } = useNotificationStore()

    useSocketEvent("notification", (data: any) => {
        if (data.receiver_id === sessionStore.profile?.id) {
            onRefresh()
            return
        }
        toast.info(data.message)
        onRefresh()
    })


    useSocketEvent("bid_create", (data: any) => {
        toast.info(data.message)
        onRefresh()
    })

    const handleSelectNotification = (item?: NotificationModel) => {
        setOpenNotification(false)
        console.log('item', item)
        if (!item) return
        if (Number(item.type) === NotificationType.LIKE) {
            navigate(`/post/${item.post_id}`)
            return
        }
        if (Number(item.type) === NotificationType.MESSAGE) {
            navigate(`/home/message/${item.sender_id}`)
            return
        }
        if (Number(item.type) === NotificationType.SET_BID) {
            navigate(`/auction/${item.post_id}`)
            return
        }
    }

    const listPages = [
        {
            key: 0,
            title: 'Home',
            icon: 'home-outline',
            link: '/home',
        },
        {
            key: 2,
            title: "Profile",
            icon: "profile-outline",
            link: '/home/profile/my_post'
        },
        {
            key: 3,
            title: "Users",
            icon: "group-outline",
            link: '/home/member'
        },
        {
            key: 4,
            title: 'Messages',
            icon: "messenger-outline",
            link: ''
        }
    ]

    return (
        <div className="w-full h-14 flex items-center justify-center border-b border-gray-300 bg-white shadow">
            <div className="w-full max-w-[1440px] h-full flex items-center justify-between px-3">
                <div className="w-[240px] h-full py-1 flex items-center justify-start space-x-2 cursor-pointer"
                    onClick={() => { navigate('/home') }}
                >
                    <img src="/images/logo-landing-plan.png" alt="" className="h-full object-contain bg-blue-300 rounded" />
                    <span className="text-lg font-medium text-green-900">LANDING PLAN</span>
                </div>
                <div className="h-full w-full max-w-[680px] flex items-center justify-center space-x-2">
                    {
                        listPages.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames("w-full h-13 flex flex-col items-center justify-center space-y-0.5 cursor-pointer  text-[14px] font-medium",
                                        { 'text-blue-600 border-b-2 border-blue-600': activeScreen === item.key },
                                        { 'text-white rounded hover:bg-gray-200': activeScreen !== item.key }
                                    )}
                                    onClick={(e) => {
                                        setActiveScreen(item.key)
                                        navigate(item.link, { replace: true })
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
                    <div className="size-10 rounded-full flex flex-col items-center justify-center space-y-1 cursor-pointer hover:bg-gray-300 bg-gray-200"
                        onClick={() => {
                            navigate('/')
                        }}
                    >
                        <IconBase icon="allocation-outline" size={28} color={Colors.gray[700]} />
                    </div>
                    <Dropdown trigger={['click']}
                        dropdownRender={() => <DropdownNotification onSelect={(item) => { handleSelectNotification(item) }} />}
                        open={openNotification}
                        onOpenChange={(value) => setOpenNotification(value)}
                    >
                        <div className="size-10 rounded-full flex flex-col items-center justify-center space-y-1 cursor-pointer hover:bg-gray-300 bg-gray-200 relative">
                            <IconBase icon="notification-outline" size={28} color={Colors.gray[700]} />
                            {data.filter((item) => item.is_read === 0).length > 0 && <div className="absolute top-0 right-0 bg-red-600 size-3 flex items-center justify-center rounded-full text- text-white font-bold flex-none">
                            </div>}
                        </div>
                    </Dropdown>
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