import { observer } from "mobx-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ButtonLoading } from "src/components";
import { InputForm } from "../../../components/Input";
import { AuthApi } from "../../../core/api";
import { setToken } from "../../../core/config";
import { useCoreStores } from "../../../core/stores";

export const FormLogin = observer(() => {
    const [hidePassword, setHidePassword] = useState(true);
    const [inputNameValue, setInputNameValue] = useState<string>('');
    const [inputPassValue, setInputPassValue] = useState<string>('');
    const [err, setErr] = useState<string>('');
    const { sessionStore } = useCoreStores();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setErr('')
        if (!inputNameValue) {
            setErr('Please enter your name')
            return;
        }
        if (!inputPassValue) {
            setErr('Please enter your password')
            return;
        }
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
            toast('Login successfully')
            
            // Chuyển hướng về trang trước đó nếu có
            const from = location.state?.from || '/home';
            navigate(from, { replace: true });
            return;
        }
        setErr(res.Message)
    }

    return <div className="w-[500px] h-full flex flex-col items-center">
        <div className="w-full bg-transparent flex flex-col border rounded-2xl border-gray-300 p-8 text-[16px] shadow">
            <span className="text-4xl text-gray-900 font-bold">Login</span>
            <div className="flex flex-col space-y-3 mt-10">
                <InputForm label="Username" value={inputNameValue} onChange={(e) => { setInputNameValue(e.target.value) }} />
                <InputForm label="Password" value={inputPassValue} onChange={(e) => { setInputPassValue(e.target.value) }} type="password" />
            </div>

            {err && <span className="text-red-400 mt-2 bg-red-50 px-3 py-2 rounded">{err}</span>}
            <ButtonLoading label="Login" className="h-14 w-full flex items-center justify-center rounded-full mt-10 text-xl" template="ActionBlue" onClick={handleLogin} loading={loading} />
        </div>
        <ButtonLoading
            label="Create an account"
            template="ActionBaseBorder"
            className="h-14 w-full flex items-center justify-center rounded-full mt-10 text-xl bg-transparent"
            onClick={() => { navigate('/auth/register') }} />
    </div>;
})