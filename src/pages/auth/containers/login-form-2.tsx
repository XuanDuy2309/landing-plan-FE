import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ButtonLoading } from 'src/components';
import { AuthApi } from 'src/core/api';
import { setToken } from 'src/core/config';
import { useCoreStores } from 'src/core/stores';

interface IProps {
    isSignup: boolean,
    setIsSignup: (value: boolean) => void
}

export const LoginForm2 = ({ isSignup, setIsSignup }: IProps) => {
    const [inputNameValue, setInputNameValue] = useState<string>('');
    const [inputPassValue, setInputPassValue] = useState<string>('');
    const [err, setErr] = useState<string>('');
    const [errPassword, setErrPassword] = useState<string>('');
    const [errUsername, setErrUsername] = useState<string>('');
    const { sessionStore } = useCoreStores();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        // setErr('')
        setErrPassword('')
        setErrUsername('')
        let isValid = true
        if (!inputNameValue) {
            setErrUsername('Vui lòng nhập tên đăng nhập');
            isValid = false
        }
        if (!inputPassValue) {
            console.log('inputPassValue', inputPassValue)
            setErrPassword('Vui lòng nhập mật khẩu');
            isValid = false
        }
        if (!isValid) return
        const params = {
            username: inputNameValue,
            password: inputPassValue
        }
        setLoading(true)
        const res = await AuthApi.login(params)
        setLoading(false)
        if (res.Status) {
            sessionStore.setSession({
                access_token: res.Data.data.access_token
            })
            sessionStore.setProfile(res.Data.data)
            setToken(res.Data.data.access_token);
            toast('Đăng nhập thành công')
            const from = location.state?.from || '/home';
            navigate(from, { replace: true });
            return;
        }
        setErr(res.Message)
    }



    return (
        <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out
                           ${isSignup
                    ? 'opacity-0 z-10 pointer-events-none'
                    : 'translate-x-0 opacity-100 z-20 pointer-events-auto'
                }`}
        >
            <form onSubmit={e => e.preventDefault()} className="bg-white flex flex-col justify-center items-center px-10 h-full">
                <h1 className="text-xl font-semibold">Đăng nhập</h1>
                <span className="text-sm mb-3">hoặc sử dụng email và mật khẩu</span>
                <input
                    className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm"
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={inputNameValue}
                    onChange={e => setInputNameValue(e.target.value)}
                />
                {errUsername && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{errUsername}</span>}
                <input
                    className="bg-gray-200 my-2 py-2 px-3 rounded w-full text-sm"
                    type="password"
                    placeholder="Mật khẩu"
                    value={inputPassValue}
                    onChange={e => setInputPassValue(e.target.value)}
                />
                {errPassword && <span className='text-red-400 text-[12px] leading-[10px] text-start w-full'>{errPassword}</span>}
                {err && <span className="text-red-400 mt-2 bg-red-50 px-3 py-2 rounded">{err}</span>}
                {/* <button className="bg-purple-800 text-white uppercase text-xs font-semibold py-2 px-8 rounded mt-3">Đăng nhập</button> */}
                <ButtonLoading
                    label='Đăng nhập'
                    template='ActionBlue'
                    className="uppercase text-xs font-semibold py-2 px-8 rounded mt-3 w-[140px]"
                    onClick={handleLogin}
                    loading={loading}
                    size='xs'
                />
            </form>
        </div>
    )
}
