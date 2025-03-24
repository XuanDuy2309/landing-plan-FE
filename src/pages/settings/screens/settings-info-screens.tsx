import { Dropdown, MenuProps, Spin } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react"
import moment from "moment";
import { useRef, useState } from "react";
import { Colors } from "src/assets";
import { ButtonLoading, DatePickerAnt, IconBase, InputEditing, InputLabel, ModalBase, ModalSelectImage, RadioGroup } from "src/components";
import { Gender, Role, Status } from "src/core/models";
import { useUserContext } from "src/core/modules";
import { BannerSettingInfo } from "../containers/settings-info/banner-setting-info";

export const SettingsInfoScreen = observer(() => {
    const { data, loading, onUpdateInfo } = useUserContext();

    return (<>
        {!data && loading ?
            <div className="w-full h-full flex items-center justify-center">
                <Spin />
            </div> :
            <div className="w-full p-4 ">
                <div className="w-full h-full bg-white flex flex-col rounded overflow-hidden">
                    <BannerSettingInfo />
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
                                <span >{'Ngày sinh'}:</span>
                            </div>
                            <div className='w-full'>
                                <DatePickerAnt
                                    value={data.dob ? moment(data.dob) : undefined}
                                    onChange={(value) => { data.dob = value }}
                                    placeholder={'dd/mm/yyyy'}
                                    className='p-0 border-none'
                                    format={"DD/MM/YYYY"}
                                />
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

                        <div className='w-full flex flex-row space-x-2 items-center'>
                            <div className={'w-[130px] flex-none flex flex-row justify-end '}>
                                <span >{'Trạng thái'}:</span>
                            </div>
                            <div className='w-full'>
                                <span>{data.status === Status.active ? 'Hoạt động' : 'Khoá'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-3 flex items-center justify-end space-x-2">
                        <ButtonLoading label="Cập nhật" size="xs" template="ActionBlue" onClick={() => {
                            onUpdateInfo();
                        }} />
                    </div>
                </div>
            </div>}
    </>)
})