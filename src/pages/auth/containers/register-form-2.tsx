import { observer } from "mobx-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AuthApi } from "src/core/api";
import { setToken } from "src/core/config";
import { UserModel } from "src/core/models";
import { useCoreStores } from "src/core/stores";

interface IProps {
    isSignup: boolean
}

export const RegisterForm2 = observer(({ isSignup }: IProps) => {
    const [data, setData] = useState<UserModel>(new UserModel());
    const [errMessage, setErrorMessage] = useState<string>('');
    const [agree, setAgree] = useState<boolean>(false);
    const { sessionStore } = useCoreStores();
    const [loading, setLoading] = useState<boolean>(false);

    const isValid = () => {
        let isValid = true;
        setErrorMessage('');
        data.err_confirm_password = '';
        data.err_email = '';
        data.err_fullname = '';
        data.err_password = '';
        data.err_phone_number = '';
        data.err_username = '';
        if (!data.fullname) {
            data.err_fullname = 'Vui lòng nhập họ và tên';
            isValid = false
        }

        if (!data.phone_number) {
            data.err_phone_number = 'Vui lòng nhập số điện thoại';
            isValid = false
        }
        if (!data.username) {
            data.err_username = 'Vui lòng nhập tên đăng nhập';
            isValid = false
        }
        if (!data.password) {
            data.err_password = 'Vui lòng nhập mật khẩu';
            isValid = false
        }
        if (!data.confirm_password) {
            data.err_confirm_password = 'Vui lòng xác nhận mật khẩu';
            isValid = false
        }
        if (data.password !== data.confirm_password) {
            data.err_confirm_password = 'Mật khẩu xác nhận không khớp';
            isValid = false
        }
        return isValid
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid() === false) {
            return;
        }
        const params = { ...data };
        setLoading(true);
        const res = await AuthApi.register(params);
        setLoading(false);
        if (res.Status) {
            sessionStore.setSession({
                access_token: res.Data.data.access_token
            });
            sessionStore.setProfile(res.Data.data);
            setToken(res.Data.data.access_token);
            toast('Đăng ký thành công');
            // Có thể chuyển sang trang khác nếu muốn
            return;
        }
        toast.error(res.Message);
        setErrorMessage(res.Message);
    };


    return (
        <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out
                            ${isSignup
                    ? 'translate-x-full opacity-100 z-20 pointer-events-auto'
                    : 'opacity-0 z-10 pointer-events-none'
                }`}
        >
            <div className="bg-white flex flex-col justify-center items-center px-10 h-full">
                <h1 className="text-xl font-semibold">Tạo tài khoản</h1>
                <span className="text-sm mb-3">hoặc sử dụng email để đăng ký</span>
                <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" type="text" placeholder="Họ và tên" value={data.fullname} onChange={(e) => data.fullname = e.target.value} />
                {data.err_fullname && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{data.err_fullname}</span>}
                {/* <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" type="email" placeholder="Email" value={data.email} onChange={(e) => data.email = e.target.value} /> */}
                <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" placeholder="Số điện thoại" value={data.phone_number} onChange={(e) => data.phone_number = e.target.value} />
                {data.err_phone_number && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{data.err_phone_number}</span>}
                <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" placeholder="Tên đăng nhập" value={data.username} onChange={(e) => data.username = e.target.value} />
                {data.err_username && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{data.err_username}</span>}
                <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" type="password" placeholder="Mật khẩu" value={data.password} onChange={(e) => data.password = e.target.value} />
                {data.err_password && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{data.err_password}</span>}
                <input className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm" type="password" placeholder="Xác nhận mật khẩu" value={data.confirm_password} onChange={(e) => data.confirm_password = e.target.value} />
                {data.err_confirm_password && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{data.err_confirm_password}</span>}
                {/* {errMessage && <span className="text-red-400 mt-2 bg-red-50 px-3 py-2 rounded">{errMessage}</span>} */}
                <button className="bg-purple-800 text-white uppercase text-xs font-semibold py-2 px-8 rounded mt-3 w-[140px]"
                    onClick={(e) => handleRegister(e)}
                // disabled={!agree}
                >Đăng ký</button>
            </div>
        </div>
    )
}
)
