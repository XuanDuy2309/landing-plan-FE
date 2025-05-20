import { Spin } from "antd";
import { observer } from "mobx-react";
import { ImageContextProvider, useImageContext, useUserContext } from "src/core/modules";
import { useCoreStores } from "src/core/stores";
import { ItemMyImage } from "../../components/item-my-image";

interface IProps {
    id?: number
}

export const ListImageDetailMember = observer(({ id }: IProps) => {
    const { sessionStore } = useCoreStores();
    return (
        <ImageContextProvider id={id}>
            <SelectImage />
        </ImageContextProvider>
    )
})



const SelectImage = observer(() => {
    const { data, dataVideo, loading } = useImageContext();
    const { onUpdateAvatar, onUpdateBackground } = useUserContext();

    return (
        <div className="w-full flex flex-col items-center space-y-3 py-4">
            <div className="w-full h-full max-w-[1240px] bg-white rounded-xl flex flex-col">
                <div className="w-full h-16 px-3 flex items-center justify-between border-b border-gray-200 flex-none">
                    <span className="text-2xl font-semibold text-gray-700">Hình ảnh</span>
                    {/* <ButtonLoading iconLeft="uploadimage-outline" label="Thêm ảnh mới" template="ActionBlueOutline" size="xs" onClick={() => handleUpload('image')} /> */}
                </div>
                <div className="w-full flex flex-col border-b border-gray-200 space-y-4 p-3">
                    {loading ?
                        <div className="w-full h-full flex items-center justify-center">
                            <Spin />
                        </div>
                        :
                        <div className="w-full  grid-cols-5 grid gap-3">
                            {
                                data.map((item, index) => {
                                    return (
                                        <ItemMyImage key={index} item={item.link} />
                                    )
                                })
                            }
                        </div>}
                    {
                        !loading && data.length === 0 && <div className="w-full h-[100px] items-center justify-center flex">

                            <span className="text-lg text-gray-700">Chưa có ảnh nào</span>
                        </div>

                    }
                </div>
            </div>
            <div className="w-full h-full max-w-[1240px] bg-white rounded-xl flex flex-col">
                <div className="w-full h-16 px-3 flex items-center justify-between border-b border-gray-200 flex-none">
                    <span className="text-2xl font-semibold text-gray-700">Video</span>
                    {/* <ButtonLoading iconLeft="uploadimage-outline" label="Thêm video mới" template="ActionBlueOutline" size="xs" onClick={() => handleUpload('video')} /> */}
                </div>
                <div className="w-full flex flex-col border-b border-gray-200 space-y-4 p-3">
                    {loading ?
                        <div className="w-full h-full flex items-center justify-center">
                            <Spin />
                        </div>
                        :
                        <div className="w-full  grid-cols-5 grid gap-3">
                            {
                                dataVideo.map((item, index) => {
                                    return (
                                        <ItemMyImage key={index} item={item.link} type="video" />
                                    )
                                })
                            }
                        </div>}
                    {
                        !loading && dataVideo.length === 0 && <div className="w-full h-[100px] items-center justify-center flex">

                            <span className="text-lg text-gray-700">Chưa có video nào</span>
                        </div>

                    }
                </div>
            </div>
        </div>)

})