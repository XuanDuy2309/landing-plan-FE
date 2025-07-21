import { Switch } from 'antd';
import { observer } from 'mobx-react';
import { DropdownSelectLandingType } from 'src/components';
import { Status } from 'src/core/models';
import { useCreateLandTypeChangeContext } from 'src/core/modules';

export const CreateLandTypeChangeContent = observer(() => {
    const { data, onSubmit } = useCreateLandTypeChangeContext();
    const handleChange = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
        data[field] = value;
    };

    return (
        <div
            className="w-full flex flex-col gap-4 pb-3"
        >
            {/* Thông tin cá nhân */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Khu vực:</span>
                    <span className=" text-end text-[14px] leading-4 text-gray-700">{data.name || ''}</span>

                </div>

                <div className="flex items-center gap-2">
                    <DropdownSelectLandingType
                        onSelect={(item) => {
                            data.land_type_id = item.id
                            data.land_type_code = item.code
                        }}
                        value={data.land_type_name}
                        error={data.err_land_type_id}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Trạng thái:</span>
                    <Switch
                        checked={data.status === Status.active}
                        onChange={(checked) => handleChange('status', checked ? Status.active : Status.inactive)}
                    />
                    <span>{data.status === Status.active ? 'Hoạt động' : 'Ngưng hoạt động'}</span>
                </div>

            </div>
        </div>
    );
});
