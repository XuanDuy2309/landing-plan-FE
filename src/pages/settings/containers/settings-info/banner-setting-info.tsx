import { Spin } from "antd";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { Colors } from "src/assets";
import { ButtonLoading, IconBase, ModalBase, ModalSelectImage } from "src/components";
import { getColorFromId } from "src/core/base";
import { useUserContext } from "src/core/modules";

export const BannerSettingInfo = observer(() => {
    const { data, loading, onUpdateAvatar, onUpdateBackground, onDeleteAvatar, onDeleteBackground } = useUserContext();
    const imageModalRef = useRef<any>(null);
    const [changeAvatar, setChangeAvatar] = useState<boolean>(false);
    const { open, close } = imageModalRef?.current || {};
    const handleSelectImage = (image?: string) => {
        close();
        if (!image) return;
        onUpdateAvatar(image);
    }

    const handleChangeBackground = (image?: string) => {
        close();
        if (!image) return;
        onUpdateBackground(image);
    }
    return (
        <div className="w-full flex justify-center bg-white">
            <div className="w-full h-[320px] bg-linear-to-b rounded-md from-white to-gray-500 relative max-w-[1240px] bg-white">
                {data.background && <img src={data.background} alt="" className="w-full h-full object-cover" />}
                <div className="absolute bottom-0 left-0 right-0 w-full h-10 flex items-end justify-between p-3">
                    <div className="size-[120px] relative flex items-center justify-center bg-white rounded-full">

                        <div className='size-[110px] rounded-full flex items-center bg-gray-200 hover:opacity-70 justify-center overflow-hidden'
                            style={{
                                backgroundColor: getColorFromId(data?.id || 0)
                            }}
                        >
                            {
                                loading ?
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Spin />
                                    </div>
                                    : (data && data?.avatar ?
                                        <img src={data.avatar} alt="" className="size-full object-cover" />
                                        :
                                        <span className="text-7xl font-bold text-white">{data?.fullname?.charAt(0).toUpperCase()}</span>)

                            }
                        </div>
                        <div
                            onClick={() => { open(), setChangeAvatar(true) }}
                            className="size-9  absolute bottom-0 right-0 rounded-full flex items-center justify-center bg-gray-700 cursor-pointer">
                            <IconBase icon='camera-outline' size={20} color={Colors.white} />
                        </div>
                    </div>
                    <ButtonLoading
                        size="xs"
                        label="Thay đổi ảnh bìa"
                        className="flex items-center justify-center rounded cursor-pointer"
                        template="ActionBase"
                        iconLeft="edit-outline"
                        onClick={(e) => { open(), setChangeAvatar(false) }} />
                </div>
                <ModalBase
                    ref={imageModalRef}
                >
                    <ModalSelectImage onSave={(item) => {
                        if (changeAvatar) { handleSelectImage(item); return }
                        handleChangeBackground(item);
                    }}
                        onClose={close}
                        onDelete={() => {
                            close();
                            if (changeAvatar) { onDeleteAvatar(); return }
                            onDeleteBackground();
                        }}
                    />
                </ModalBase>
            </div>
        </div>
    );
})