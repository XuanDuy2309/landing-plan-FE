import { observer } from "mobx-react";
import { useCoreStores } from "../../../core/stores";
import { AuthApi } from "../../../core/api";
import { ImageContextProvider, useImageContext, useUserContext } from "src/core/modules";
import { ButtonLoading, IconBase } from "src/components";
import classNames from "classnames";
import { Spin } from "antd";
import { Colors } from "src/assets";
import { SelectFileCase } from "src/core/services";
import { use, useState } from "react";
import { ItemMyImage } from "../components/item-my-image";

export const ProfileImageScreen = observer(() => {
    const { sessionStore } = useCoreStores();
    return (
        <ImageContextProvider>
            <SelectImage />
        </ImageContextProvider>
    )
})



const SelectImage = observer(() => {
    const { data, loading, onUpload } = useImageContext();
    const { onUpdateAvatar, onUpdateBackground } = useUserContext();

    const handleUpload = async () => {
        const input = new SelectFileCase('image', false);
        await input.process()
            .then(res => {
                if (res.length > 0) { onUpload(res[0]); }
            })
            .catch(err => console.log(err));
    }

    const actionItemImage = {
        updateAvatar: (image: string) => onUpdateAvatar(image),
        updateBackground: (image: string) => onUpdateBackground(image),
        deleteImage: (id: number) => { console.log(id) }
    }

    return (
        <div className="w-full flex flex-col items-center py-4">
            <div className="w-full h-full max-w-[1240px] bg-white rounded-xl flex flex-col">
                <div className="w-full h-16 px-3 flex items-center justify-between border-b border-gray-200 flex-none">
                    <span className="text-2xl font-semibold text-gray-700">Ảnh của bạn</span>
                    <ButtonLoading iconLeft="uploadimage-outline" label="Upload new image" template="ActionBlueOutline" size="xs" onClick={handleUpload} />
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
                                        <ItemMyImage key={index} item={item} action={actionItemImage} />
                                    )
                                })
                            }
                        </div>}
                </div>
            </div>
        </div>)

})