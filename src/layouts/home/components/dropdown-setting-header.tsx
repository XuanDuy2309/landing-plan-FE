import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { getColorFromId } from "src/core/base";
import { Role } from "src/core/models";
import { useCoreStores } from "src/core/stores";

interface IProps {
    onSelect?: () => void
}

export const DropdownSettingHeader = observer(({ onSelect }: IProps) => {
    const { sessionStore } = useCoreStores();
    const navigate = useNavigate();
    const listOptions = [
        {
            icon: 'settings-outline',
            title: 'Thiết lập tài khoản',
            onclick: () => {
                navigate('/settings/info')
                onSelect && onSelect()
            }
        },
        ...sessionStore.profile?.role === Role.admin ? [
            {
                icon: 'category-outline',
                title: 'Trang quản trị',
                onclick: () => {
                    navigate('/admin')
                    onSelect && onSelect()
                }
            },
        ] : [],
        {
            icon: 'logout-outline',
            title: 'Đăng xuất',
            onclick: () => {
                handleLogout()
                onSelect && onSelect()

            }
        }
    ]

    const handleLogout = () => {
        sessionStore.logout();
    }
    return <div className="w-[400px] bg-gray-100 rounded-xl shadow p-3 flex flex-col space-y-3">
        <div className="w-full bg-white rounded-md p-2 flex items-center space-x-2 shadow cursor-pointer"
            onClick={() => {
                onSelect && onSelect()
            }}
        >
            <div className='size-10 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'
                style={{
                    backgroundColor: getColorFromId(sessionStore.profile?.id || 0)
                }}
            >
                {
                    sessionStore.profile && sessionStore.profile?.avatar ?
                        <img src={sessionStore.profile.avatar} alt="" className="size-full object-cover" />
                        :
                        <span className="text-2xl font-bold text-white">{sessionStore.profile?.fullname?.charAt(0).toUpperCase()}</span>

                }
            </div>
            <span className="text-xl font-medium text-gray-900">{sessionStore.profile?.fullname}</span>
        </div>
        <div className="w-full flex flex-col">
            {
                listOptions.map((item, index) => {
                    return (
                        <div className={`w-full p-2 group flex items-center space-x-2 hover:bg-gray-200 rounded-md`}
                            key={index}
                            onClick={item.onclick}>
                            <div className={`size-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 group-hover:bg-gray-300`}>
                                <IconBase icon={item.icon} size={24} color={Colors.black} />
                            </div>
                            <span className="text-xl text-gray-900 font-medium">{item.title}</span>
                        </div>
                    )
                })
            }
        </div>
    </div>;
});