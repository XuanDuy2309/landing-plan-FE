import { ColorPicker } from 'antd';
import { observer } from 'mobx-react';
import { useCreateLandTypeContext } from 'src/core/modules';
import { useListUserContext } from 'src/core/modules/user/context';

export const CreateLandTypeContent = observer(() => {
    const { data, onSubmit } = useCreateLandTypeContext();
    const { itemUpdate } = useListUserContext()
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
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Loại đất:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.name || ''}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="Nhập họ và tên"
                    />
                </div>
                {data.err_name && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_name}</span>}

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Mã loại đất:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.code || ''}
                        onChange={e => handleChange('code', e.target.value)}
                        placeholder="Nhập mã"
                    />
                </div>
                {data.err_code && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_code}</span>}

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Mã màu:</span>
                    <ColorPicker value={data.color} onChange={color => {
                        const hex = color.toHexString(); // -> Ví dụ: "#ff0000"
                        handleChange('color', hex)
                    }} />
                </div>
                {data.color && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.color}</span>}


            </div>
        </div>
    );
});
