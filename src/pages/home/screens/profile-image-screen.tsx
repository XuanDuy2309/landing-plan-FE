import { Spin } from "antd";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { ButtonLoading } from "src/components";
import { ImageContextProvider, useImageContext, useUserContext } from "src/core/modules";
import { SelectFileCase } from "src/core/services";
import { useCoreStores } from "../../../core/stores";
import { ItemMyImage } from "../components/item-my-image";

interface IProps {
    id?: number
}

export const ProfileImageScreen = observer(({ id }: IProps) => {
    const { sessionStore } = useCoreStores();
    return (
        <ImageContextProvider id={id}>
            <SelectImage />
        </ImageContextProvider>
    )
})



const SelectImage = observer(() => {
    const { data, dataVideo, loading, onUpload, onDeleteMedia, onRefresh } = useImageContext();
    const { onUpdateAvatar, onUpdateBackground } = useUserContext();

    const handleUpload = async (type: string) => {
        const input = new SelectFileCase(type, false);
        await input.process()
            .then(res => {
                if (res.length > 0) { onUpload(res[0], type); }
            })
            .catch(err => console.log(err));
    }

    const actionItemImage = {
        updateAvatar: (image: string) => onUpdateAvatar(image),
        updateBackground: (image: string) => onUpdateBackground(image),
        deleteImage: async (id: number) => {
            await onDeleteMedia(id).then((res) => {
                if (res.Status) {
                    toast.success("Xóa thành công");
                }
                onRefresh();
            }).catch((err) => {
                toast.error("Xóa thất bại");
                console.error(err);
            })
        }
    }
    return (
        <div className="w-full flex flex-col items-center space-y-3 py-4">
            <div className="w-full h-full max-w-[1240px] bg-white rounded-xl flex flex-col">
                <div className="w-full h-16 px-3 flex items-center justify-between border-b border-gray-200 flex-none">
                    <span className="text-2xl font-semibold text-gray-700">Ảnh của bạn</span>
                    <ButtonLoading iconLeft="uploadimage-outline" label="Thêm ảnh mới" template="ActionBlueOutline" size="xs" onClick={() => handleUpload('image')} />
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
                                        <ItemMyImage id={item.id} key={index} item={item.link} action={actionItemImage} />
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
                    <span className="text-2xl font-semibold text-gray-700">Video của bạn</span>
                    <ButtonLoading iconLeft="uploadimage-outline" label="Thêm video mới" template="ActionBlueOutline" size="xs" onClick={() => handleUpload('video')} />
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
                                        <ItemMyImage key={index} item={item.link} action={actionItemImage} type="video" />
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