import { Dropdown, MenuProps, Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react"
import { useRef, useState } from "react";
import { Colors } from "src/assets";
import { ButtonLoading, IconBase, InputEditing, InputLabel, ModalBase, ModalSelectImage, RadioGroup } from "src/components";
import { Gender, Role } from "src/core/models";
import { useUserContext } from "src/core/modules";

export const SettingsInfoScreen = observer(() => {
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

    return (<>
        {!data && loading ?
            <div className="w-full h-full flex items-center justify-center">
                <Spin />
            </div> :
            <div className="w-full p-4 ">
                <div className="w-full h-full bg-white flex flex-col rounded overflow-hidden">
                    <div className="w-full h-[320px] bg-linear-to-b from-white to-gray-500 relative">
                        {data.background && <img src={data.background} alt="" className="w-full h-full object-cover" />}
                        <div className="absolute bottom-0 left-0 right-0 w-full h-10 flex items-end justify-between p-3">
                            <div className="size-[120px] relative flex items-center justify-center bg-white rounded-full">

                                <div className='size-[110px] rounded-full flex items-center bg-gray-200 hover:opacity-70 justify-center overflow-hidden'>
                                    {
                                        loading ?
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Spin />
                                            </div>
                                            : (data && data?.avatar ?
                                                <img src={data.avatar} alt="" className="size-full object-cover" />
                                                :
                                                <span className="text-7xl font-bold text-gray-900">{data?.fullname?.charAt(0).toUpperCase()}</span>)

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
                                label="Edit background"
                                className="flex items-center justify-center rounded cursor-pointer"
                                template="ActionBase"
                                iconLeft="edit-outline"
                                onClick={(e) => { open(), setChangeAvatar(false) }} />
                        </div>
                    </div>
                    <div className="w-full p-3 flex flex-col">
                        <span className="text-lg font-medium text-gray-700">Thông tin cá nhân</span>
                        <InputLabel
                            label="Họ và tên"
                            value={data?.fullname || ''}
                            onChange={(value) => { data.fullname = value }}
                            placeholder="Nhập họ và tên" />
                        <InputLabel
                            label="Số điện thoại"
                            value={data?.phone_number || ''}
                            onChange={(value) => { data.phone_number = value }}
                            placeholder="Nhập số điện thoại" />
                        <InputLabel
                            label="Email"
                            value={data?.email || ''}
                            onChange={(value) => { data.email = value }}
                            placeholder="Nhập email" />
                        <InputLabel
                            label="Địa chỉ"
                            value={data?.address || ''}
                            onChange={(value) => { data.address = value }}
                            placeholder="Nhập địa chi" />
                        <div className='w-full flex flex-row space-x-2 items-center'>
                            <div className={'w-[130px] flex-none flex flex-row justify-end '}>
                                <span >{'Giới tính'}:</span>
                            </div>
                            <div className='w-full'>
                                <RadioGroup
                                    primary
                                    data={[
                                        { label: 'Nam', value: Gender.male },
                                        { label: 'Nữ', value: Gender.female },
                                        { label: 'Khác', value: Gender.other },
                                    ]}
                                    value={data.gender} onChange={(value) => { data.gender = value }} />
                            </div>
                        </div>
                        <div className='w-full flex flex-row space-x-2 items-center'>
                            <div className={'w-[130px] flex-none flex flex-row justify-end '}>
                                <span >{'Vai trò'}:</span>
                            </div>
                            <div className='w-full'>
                                <span>{data.role === Role.admin ? 'Quản trị viên' : 'Người dùng'}</span>
                            </div>
                        </div>

                    </div>
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
            </div>}
    </>)
})