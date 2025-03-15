import { observer } from "mobx-react";
import { FormLogin } from "../containers/form-login";
import { useState } from "react";
import { UserModel } from "src/core/models";
import { ButtonLoading, InputForm } from "src/components";
import { CheckBox } from "src/components/checkbox";
import { useNavigate } from "react-router-dom";
import { set } from "mobx";
import { AuthApi } from "src/core/api";
import { ISession, useCoreStores } from "src/core/stores";
import { setToken } from "src/core/config";
import { ToastContainer, toast } from 'react-toastify';

export const RegisterScreen = observer(() => {
    const [data, setData] = useState<UserModel>(new UserModel)
    const [errMessage, setErrorMessage] = useState<string>('')
    const [agree, setAgree] = useState<boolean>(false)
    const navigate = useNavigate()
    const { sessionStore } = useCoreStores()
    const [loading, setLoading] = useState<boolean>(false)

    const isValid = () => {
        setErrorMessage('')
        data.err_confirm_password = ''
        data.err_email = ''
        data.err_fullname = ''
        data.err_password = ''
        data.err_phone_number = ''
        data.err_username = ''
        if (!data.fullname) {
            data.err_fullname = 'Fullname is required'
            return 'Fullname is required'
        }
        if (!data.email) {
            data.err_email = 'Email is required'
            return 'Email is required'
        }
        if (!data.phone_number) {
            data.err_phone_number = 'Phone number is required'
            return 'Phone number is required'
        }
        if (!data.username) {
            data.err_username = 'Username is required'
            return 'Username is required'
        }
        if (!data.password) {
            data.err_password = 'Password is required'
            return 'Password is required'
        }
        if (!data.confirm_password) {
            data.err_confirm_password = 'Confirm password is required'
            return 'Confirm password is required'
        }
        if (data.password !== data.confirm_password) {
            data.err_confirm_password = 'Confirm password does not match'
            return 'Confirm password does not match'
        }
        return ''
    }

    const handleRegister = async () => {
        if (isValid() !== '') {
            setErrorMessage(isValid())
            return
        }
        const params = {
            ...data
        }
        setLoading(true)
        const res = await AuthApi.register(params)
        setLoading(false)
        if (res.Status) {
            sessionStore.session = new ISession();
            Object.assign(sessionStore.session, {
                access_token: res.Data.data.access_token
            });
            sessionStore.profile = new UserModel();
            Object.assign(sessionStore.profile, res.Data.data);
            setToken(res.Data.data.access_token);
            toast('Sign up successfully')
            return
        }
        console.log('ressss', res)
        setErrorMessage(res.Message)
    }
    return <div className="w-full h-full flex justify-center overflow-y-auto bg-[url('src/assets/images/bg-auth.png')] bg-contain bg-left-top bg-no-repeat bg-gray-100">
        <div className="w-[500px] h-full flex flex-col items-center py-12">
            <div className="w-full bg-transparent flex flex-col border rounded-2xl border-gray-300 p-8 text-[16px]">
                <span className="text-4xl text-gray-900 font-bold">Register</span>
                <div className="flex flex-col space-y-3 mt-10">
                    <InputForm label="Fullname" value={data.fullname || ''} onChange={(e) => { data.fullname = e.target.value }} error={data.err_fullname} />
                    <InputForm label="Email" value={data.email || ''} onChange={(e) => { data.email = e.target.value }} error={data.err_email} />
                    <InputForm label="Phone" value={data.phone_number || ''} onChange={(e) => { data.phone_number = e.target.value }} error={data.err_phone_number} />
                    <InputForm label="Username" value={data.username || ''} onChange={(e) => { data.username = e.target.value }} error={data.err_username} />
                    <InputForm label="Password" value={data.password || ''} onChange={(e) => { data.password = e.target.value }} type="password" error={data.err_password} />
                    <InputForm label="Password" value={data.confirm_password || ''} onChange={(e) => { data.confirm_password = e.target.value }} type="password" error={data.err_confirm_password} />
                </div>
                {errMessage && <span className="text-red-500 mt-2 bg-red-50 px-3 py-2 rounded">{errMessage}</span>}
                <div className="w-full mt-4">
                    <CheckBox label="I agree to the terms and conditions" checked={agree} onChange={(value, e) => { setAgree(value) }} />
                </div>
                <ButtonLoading
                    label="Register"
                    className="h-14 w-full flex items-center justify-center rounded-full mt-4 text-xl"
                    template="ActionBlue" onClick={handleRegister} disabled={!agree}
                    loading={loading}
                />
            </div>
            <ButtonLoading
                label="Back to Login"
                template="ActionBaseBorder"
                className="h-14 w-full flex items-center justify-center rounded-full mt-10 flex-none"
                onClick={() => { navigate('/auth/login') }} />
        </div>
    </div>;
})