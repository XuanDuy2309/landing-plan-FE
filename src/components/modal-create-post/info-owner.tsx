import { observer } from "mobx-react"
import { RadioGroup } from "../radio-group"
import { useCreatePostContext } from "src/core/modules"
import { useState } from "react"
import { InputLabel } from "../input-label"

export const InfoOwner = observer(() => {
    const { data } = useCreatePostContext()
    return <div className="w-full flex flex-col space-y-2 px-3">
        <span className="text-xl font-medium text-gray-900">Thông tin liên hệ:</span>
        <div className="w-full flex items-center space-x-2">
            <span className="text-base font-medium text-gray-700">Người đăng:</span>
            <RadioGroup
                primary
                data={[{ label: 'Chủ sở hữu', value: 1 },
                { label: 'Mô giới', value: 0 }]}
                value={data.is_owner ? 1 : 0}
                onChange={(value) => {
                    data.is_owner = value === 1
                }}
            />
        </div>
        <div className="w-1/2 flex flex-col space-y-1">
            <InputLabel
                label="Họ và tên"
                value={data.create_by_name}
                onChange={(value) => {
                    data.create_by_name = value
                }}
                placeholder="Nhập họ và tên"
                error={data.err_create_by_name}
            />
            <InputLabel
                label="Số điện thoại"
                value={data.create_by_phone}
                onChange={(value) => {
                    data.create_by_phone = value
                }}
                placeholder="Nhập số điện thoại"
                error={data.err_create_by_phone}
            />
        </div>
        {
            !data.is_owner &&
            <span className="text-base font-medium text-gray-700">Thông tin chủ sở hữu:</span>}
        {
            !data.is_owner &&
            <div className="w-1/2 flex flex-col space-y-1">
                <InputLabel
                    label="Họ và tên"
                    value={data.owner_name}
                    onChange={(value) => {
                        data.owner_name = value
                    }}
                    placeholder="Nhập họ và tên"
                    error={data.err_owner_name}
                />
                <InputLabel
                    label="Số điện thoại"
                    value={data.owner_phone}
                    onChange={(value) => {
                        data.owner_phone = value
                    }}
                    placeholder="Nhập số điện thoại"
                    error={data.err_owner_phone}
                />
            </div>
        }
    </div>
})  