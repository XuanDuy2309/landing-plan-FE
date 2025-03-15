import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { AuthApi } from "src/core/api";
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
            title: 'Setting account',
            onclick: () => {
                navigate('/settings/info')
                onSelect && onSelect()
            }
        },
        {
            icon: 'logout-outline',
            title: 'Logout',
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
            <img src={sessionStore.profile?.avatar} alt="" className="size-10 rounded-full" />
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