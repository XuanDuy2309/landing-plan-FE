import { observer } from "mobx-react";
import { IconBase } from "./icon-base";
import { Colors } from "src/assets";
import { ButtonLoading } from "./Button";
import { ImageContextProvider, useImageContext } from "src/core/modules";
import { useState } from "react";
import classNames from "classnames";
import { set } from "mobx";
import { SelectFileCase } from "src/core/services";
import { Spin } from "antd";
import Icon from "@mdi/react";

interface IProps {
    onSave: (item?: string) => void
    onClose: () => void
    onDelete?: () => void
}

export const ModalSelectImage = observer(({ onSave, onClose, onDelete }: IProps) => {
    return (
        <ImageContextProvider>
            <SelectImage onSave={onSave} onClose={onClose} onDelete={onDelete} />
        </ImageContextProvider>
    )
});

const SelectImage = observer(({ onSave, onClose, onDelete }: IProps) => {
    const { data, loading, onUpload } = useImageContext();
    const [selected, setSelected] = useState<string>();

    const handleUpload = async () => {
        const input = new SelectFileCase('image', false);
        await input.process()
            .then(res => {
                if (res.length > 0) { onUpload(res[0]); }
            })
            .catch(err => console.log(err));
    }

    return <div className="w-full h-full bg-white rounded-xl flex flex-col">
        <div className="w-full h-12 px-3 flex items-center justify-between border-b border-gray-200 flex-none">
            <span className="text-2xl font-semibold text-gray-700">Hình ảnh của bạn</span>
            <div className="size-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300" onClick={onClose}>
                <IconBase icon="close-outline" size={16} color={Colors.black} />
            </div>
        </div>
        <div className="w-full h-[552px] overflow-y-auto flex flex-col border-b border-gray-200 space-y-4 p-3">
            <div className="w-full flex items-center justify-between">
                <span className="px-3 text-xl font-semibold text-gray-700">Chọn nhanh</span>
                <div className="flex items-center space-x-2">
                    {onDelete && <ButtonLoading iconLeft="delete-outline" label="Xoá ảnh đã chọn" template="ActionOrange" size="xs" onClick={onDelete} />}
                    <ButtonLoading iconLeft="uploadimage-outline" label="Thêm ảnh từ thiết bị" template="ActionBlueOutline" size="xs" onClick={handleUpload} />
                </div>
            </div>
            {loading ?
                <div className="w-full h-full flex items-center justify-center">
                    <Spin />
                </div>
                :
                <div className="w-full  grid-cols-3 grid gap-2">
                    {
                        data.map((item, index) => {
                            return (
                                <div className={classNames("w-full h-[240px] rounded-md overflow-hidden relative cursor-pointer",
                                    { 'border-2 border-blue-400': selected === item.link }
                                )} key={index} onClick={() => { setSelected(item.link) }}>
                                    <img src={item.link} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-3 right-3 rounded-full flex items-center justify-center hover:bg-gray-300">
                                        <IconBase icon={selected === item.link ? "active" : "round"} size={24} color={Colors.blue[400]} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>}
        </div>
        <div className="w-full h-12 px-3 flex items-center justify-end space-x-2">
            <ButtonLoading label="Huỷ bỏ" template="ActionBase" onClick={onClose} size="xs" />
            <ButtonLoading label="Thêm" template="ActionBlue" onClick={() => onSave(selected)} size="xs" />
        </div>
    </div>;
})