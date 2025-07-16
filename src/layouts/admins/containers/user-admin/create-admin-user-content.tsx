import { Switch } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import { DatePickerAnt, RadioGroup } from 'src/components';
import { Gender, Role, Status } from 'src/core/models/user-model';
import { useCreateAdminUserContext } from 'src/core/modules/admin/contexts/create-user-context';
import { useListUserContext } from 'src/core/modules/user/context';

export const CreateAdminUserContent = observer(() => {
    const { data, onSubmit } = useCreateAdminUserContext();
    const { itemUpdate } = useListUserContext()
    const handleChange = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
        data[field] = value;
    };

    return (
        <form
            className="w-full flex flex-col gap-4 pb-3"
            onSubmit={async (e) => {
                e.preventDefault();
                await onSubmit();
            }}
        >
            {/* Thông tin cá nhân */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Họ và tên:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.fullname || ''}
                        onChange={e => handleChange('fullname', e.target.value)}
                        placeholder="Nhập họ và tên"
                    />
                </div>
                {data.err_fullname && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_fullname}</span>}

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Email:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.email || ''}
                        onChange={e => handleChange('email', e.target.value)}
                        placeholder="Nhập email"
                        type="email"
                    />
                </div>
                {data.err_email && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_email}</span>}

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Số điện thoại:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.phone_number || ''}
                        onChange={e => handleChange('phone_number', e.target.value)}
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                {data.err_phone_number && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_phone_number}</span>}

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Địa chỉ:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.address || ''}
                        onChange={e => handleChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Ngày sinh:</span>
                    {/* <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        type="date"
                        value={data.dob || ''}
                        onChange={e => handleChange('dob', e.target.value)}
                    /> */}
                    <div className='border-b border-gray-200 focus-within:border-blue-400'>
                        <DatePickerAnt
                            value={data.dob ? moment(data.dob) : undefined}
                            format='DD/MM/YYYY'
                            onChange={(value) => data.dob = moment(value).format('YYYY-MM-DD')}
                            placeholder='DD/MM/YYYY'
                            className="!border-none p-0"
                        />
                    </div>

                </div>

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Giới tính:</span>
                    {/* <select
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.gender}
                        onChange={e => handleChange('gender', e.target.value as Gender)}
                    >
                        <option value={Gender.male}>Nam</option>
                        <option value={Gender.female}>Nữ</option>
                        <option value={Gender.other}>Khác</option>
                    </select> */}
                    <RadioGroup
                        data={[
                            { label: 'Nam', value: Gender.male },
                            { label: 'Nữ', value: Gender.female },
                            { label: 'Khác', value: Gender.other },
                        ]}
                        value={data.gender}
                        onChange={(value) => { data.gender = value }}
                        primary
                        size='medium'
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-24 text-end text-[14px] leading-4 text-gray-700">Vai trò:</span>
                    <RadioGroup
                        data={[
                            { label: 'Quản trị viên', value: Role.admin },
                            { label: 'Người dùng', value: Role.user }
                        ]}
                        primary
                        value={data.role}
                        onChange={(value) => handleChange('role', value as Role)}
                        size='medium'
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

            {/* Section: Tài khoản & mật khẩu */}
            <div className="bg-gray-100 rounded-lg p-6 flex flex-col gap-4 w-1/2">
                <div className="flex items-center gap-2">
                    <span className="w-36 text-end text-[14px] leading-4 text-gray-700">Tên đăng nhập:</span>
                    <input
                        className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                        value={data.username || ''}
                        onChange={e => handleChange('username', e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                    />
                </div>
                {data.err_username && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_username}</span>}
                {!!!itemUpdate && <>
                    <div className="flex items-center gap-2">
                        <span className="w-36 text-end text-[14px] leading-4 text-gray-700">Mật khẩu:</span>
                        <input
                            className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                            type="password"
                            value={data.password || ''}
                            onChange={e => handleChange('password', e.target.value)}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    {data.err_password && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_password}</span>}

                    <div className="flex items-center gap-2">
                        <span className="w-36 text-end text-[14px] leading-4 text-gray-700">Xác nhận mật khẩu:</span>
                        <input
                            className="w-[50%] border-0 border-b border-gray-100 focus:border-blue-400 outline-none px-2 py-2 text-[14px] leading-4 bg-transparent"
                            type="password"
                            value={data.confirm_password || ''}
                            onChange={e => handleChange('confirm_password', e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>
                    {data.err_confirm_password && <span className="text-red-400 text-[14px] leading-4 ml-40">{data.err_confirm_password}</span>}
                </>}
            </div>
        </form>
    );
});
