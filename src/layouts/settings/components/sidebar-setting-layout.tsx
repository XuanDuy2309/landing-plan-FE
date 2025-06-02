import classNames from "classnames"
import { observer } from "mobx-react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Colors } from "src/assets"
import { IconBase } from "src/components"

export const SidebarSettingLayout = observer(() => {
    const [active, setActive] = useState(0)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const menuSidebar = [
        {
            icon: "profile-outline",
            title: "Thông tin tài khoản",
            link: '/settings/info'
        },
        {
            icon: 'resetpassword-outline',
            title: 'Đổi mật khẩu',
            link: '/settings/pass'
        }
    ]
    return (
        <div className="w-[360px] h-full flex flex-col bg-white shadow border-r border-gray-300">
            <div className="w-full p-4 border-b border-gray-200 flex-none">
                <span className="text-2xl font-semibold text-gray-700">Settings account</span>
            </div>
            <div className="p-4 flex flex-col w-full h-full overflow-y-auto">
                {
                    menuSidebar.map((item, index) => {
                        return (
                            <div className={classNames("w-full p-2 flex items-center space-x-2 hover:bg-gray-200 rounded-md cursor-pointer group",
                                { 'bg-gray-200': active === index }
                            )}
                                key={index}
                                onClick={() => {
                                    navigate(item.link, { replace: true })
                                    setActive(index)
                                }}
                            >
                                <div className={classNames("size-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 group-hover:bg-gray-300",
                                    { 'bg-gray-300': active === index }
                                )}>
                                    <IconBase icon={item.icon} size={24} color={Colors.black} />
                                </div>
                                <span className="text-xl text-gray-900 font-medium">{item.title}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
})