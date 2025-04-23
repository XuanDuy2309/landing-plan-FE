import { CreatePostContextProvider, useCreatePostContext, usePostContext, useUserContext } from "src/core/modules"
import { IconBase } from "../icon-base"
import { ButtonLoading } from "../Button"
import { observer } from "mobx-react"
import { Colors } from "src/assets"
import { Dropdown, MenuProps } from "antd"
import {  useEffect } from "react"
import { Purpose_Post, Type_Post } from "src/core/models"
import { ContentCreatePost } from "./content-create-post"
import { toast } from "react-toastify"

interface IProps {
    type?: Purpose_Post
    onSave: (item?: string) => void
    onClose: () => void
}

export const ModalCreatePost = observer(({ type, onSave, onClose }: IProps) => {
    return <CreatePostContextProvider>
        <CreatePostContainer type={type} onSave={onSave} onClose={onClose} />
    </CreatePostContextProvider>
})

const CreatePostContainer = observer(({ type, onSave, onClose }: IProps) => {
    const { data, onSubmit, onClear } = useCreatePostContext()
    const { onRefresh } = usePostContext()
    const { data: user } = useUserContext()

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Công khai',
            onClick: () => { data.type = Type_Post.Public }
        },
        {
            key: '2',
            label: 'Người theo dõi',
            onClick: () => { data.type = Type_Post.Follow }
        },
        {
            key: '3',
            label: 'Chỉ mình tôi',
            onClick: () => { data.type = Type_Post.Private }
        },
    ];

    const typePost = {
        1: { label: 'Công khai', icon: 'user-outline' },
        2: { label: 'Người theo dõi', icon: 'user-outline' },
        3: { label: 'Chỉ mình tôi', icon: 'user-outline' },
    }

    useEffect(() => {
        if (type) {
            data.purpose = type
        }
    }, [type])

    return <div className="w-full h-[600px] bg-white flex-none flex flex-col">
        <div className="relative w-full h-14 flex-none border-b border-gray-200 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">Tạo bài viết</span>
            <div
                className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                onClick={() => {
                    onClose()
                    onClear()
                }}
            >
                <IconBase icon='close-outline' size={24} />
            </div>
        </div>
        <div className="w-full h-full overflow-y-auto flex flex-col">
            <div className="w-full flex-none p-3 border-gray-200 flex items-center space-x-3">
                <div className='size-14 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden'>
                    {
                        user?.avatar ?
                            <img src={user.avatar} alt="" className="size-full object-cover" />
                            :
                            <span className="text-2xl font-bold text-gray-900">{user?.fullname?.charAt(0).toUpperCase()}</span>

                    }
                </div>
                <div className="w-full flex items-center justify-between px-3">
                    <div className="w-full h-full flex flex-col justify-center space-y-1 items-start">
                        <span className="text-base font-medium text-gray-700">{user?.fullname}</span>
                        <Dropdown trigger={["click"]} menu={{ items }}>
                            <div className="flex items-center space-x-2 py-1 px-2 rounded bg-gray-200 cursor-pointer">
                                <IconBase icon={typePost[data.type].icon} size={16} color={Colors.gray[700]} />
                                <span className="text-sm text-gray-700">{typePost[data.type].label}</span>
                                <IconBase icon='arrowdown' size={16} color={Colors.gray[700]} />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <ContentCreatePost />


        </div>
        <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end">
            <ButtonLoading
                label="Đăng"
                template="ActionBlue"
                className="h-10 w-32 flex items-center justify-center text-xl font-medium"
                onClick={async () => {
                    const res = onSubmit && await onSubmit()
                    if (res?.Status) {
                        toast.success(res.Message)
                        onSave()
                        onRefresh()
                        return
                    }
                    toast.error(res?.Message)
                }}
            />
        </div>

    </div>
})
