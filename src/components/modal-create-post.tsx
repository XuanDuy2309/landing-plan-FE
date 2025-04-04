import { CreatePostContextProvider, useCreatePostContext, useUserContext } from "src/core/modules"
import { IconBase } from "./icon-base"
import { ButtonLoading } from "./Button"
import { observer } from "mobx-react"
import { Colors } from "src/assets"
import { Dropdown, MenuProps } from "antd"
import { ModalSelectImage } from "./modal-select-image"
import { ModalBase } from "./modal/modal-base"
import { useRef } from "react"

export const ModalCreatePost = observer(() => {
    return <CreatePostContextProvider>
        <CreatePostContainer />
    </CreatePostContextProvider>
})

const CreatePostContainer = observer(() => {
    const { data } = useCreatePostContext()
    const { data: user } = useUserContext()
    const modalRef = useRef<any>(null)

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Chỉ mình tôi',
            onClick: () => { data.type = '1' }
        },
        {
            key: '2',
            label: 'Người theo dõi',
            onClick: () => { data.type = '2' }
        },
        {
            key: '3',
            label: 'Công khai',
            onClick: () => { data.type = '3' }
        },
    ];

    const typePost = {
        1: { label: 'Chỉ mình tôi', icon: 'user-outline' },
        2: { label: 'Người theo dõi', icon: 'user-outline' },
        3: { label: 'Công khai', icon: 'user-outline' },
    }

    return <div className="w-full h-[600px] bg-white flex-none flex flex-col">
        <div className="relative w-full h-14 flex-none border-b border-gray-200 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">Tạo bài viết</span>
            <div
                className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
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
                            </div>
                        </Dropdown>
                    </div>
                    <div
                        className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={() => { modalRef.current.open() }}
                    >
                        <IconBase icon='image-outline' size={20} color={Colors.blue[400]} />
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end">
            <ButtonLoading
                label="Đăng"
                template="ActionBlue"
                className="h-10 w-32 flex items-center justify-center text-xl font-medium" />
        </div>
        <ModalBase
            ref={modalRef}
        >
            <ModalSelectImage
                onSave={(item?: string) => {
                    modalRef.current.close()
                }}
                onClose={() => {
                    modalRef.current.close()
                }} />
        </ModalBase>
        
    </div>
})
