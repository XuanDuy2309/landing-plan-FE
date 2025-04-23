import { observer } from "mobx-react";
import { useUserContext } from "src/core/modules";
import { useRef, useState } from "react";
import { IconBase, ModalBase } from "src/components";
import { Colors } from "src/assets";
import { useNavigate } from "react-router-dom";
import { ModalCreatePost } from "src/components/modal-create-post/modal-create-post";

export const CreatePostContainer = observer(() => {
    const { data } = useUserContext()
    const navigate = useNavigate()
    const modalRef = useRef<any>(null);
    const [typePost, setTypePost] = useState<any>()

    const listTypePost = [
        {
            label: "Đăng bán",
            value: 1,
            icon: "sale-outline"
        },
        {
            label: "Cho thuê",
            value: 2,
            icon: "approved2-outline"
        },
        {
            label: "Đấu giá",
            value: 3,
            icon: "auction-outline"
        },
    ]

    return (
        <div className="w-full p-3 flex flex-col bg-white rounded-xl">
            <div className="w-full flex items-center space-x-2 pb-3 border-b border-gray-200">
                <div className='size-10 flex-none rounded-full flex items-center bg-gray-200 justify-center overflow-hidden cursor-pointer hover:opacity-80'
                    onClick={() => {
                        navigate('/home/my_post')
                    }}
                >
                    {
                        data && data?.avatar ?
                            <img src={data.avatar} alt="" className="size-full object-cover" />
                            :
                            <span className="text-2xl font-bold text-gray-900">{data?.fullname?.charAt(0).toUpperCase()}</span>

                    }
                </div>
                <div className="w-full h-10 rounded-full px-3 flex items-center bg-gray-200 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                        modalRef.current.open()
                    }}
                >
                    <span className="text-base text-gray-700">{data.fullname}, hôm nay bạn có gì?</span>
                </div>
            </div>
            <div className="w-full flex items-center justify-between space-x-2 pt-3">
                {
                    listTypePost.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="w-full h-full py-3 flex items-center justify-center space-x-2 cursor-pointer rounded-md hover:bg-gray-200"
                                onClick={() => {
                                    setTypePost(item.value)
                                    modalRef.current.open()
                                }}
                            >
                                <IconBase icon={item.icon} size={24} color={Colors.gray[700]} />
                                <span className="text-base text-gray-700">{item.label}</span>
                            </div>
                        )
                    })
                }
            </div>
            <ModalBase
                ref={modalRef}
            >
                <ModalCreatePost    type={typePost} onClose={() => { modalRef.current.close() }} onSave={(item) => { modalRef.current.close() }} />
                
            </ModalBase>
        </div>
    );
})