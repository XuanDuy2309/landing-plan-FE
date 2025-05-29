import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { AuthApi } from "../../../api";
import { setToken } from "../../../config";
import { UserModel } from "../../../models";
import { hideLoading, showLoading } from "../../../services";
import { useCoreStores } from "../../../stores";

class IPass {
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
    err_old_password?: string;
    err_new_password?: string;
    err_confirm_password?: string;
    constructor() {
        makeAutoObservable(this)
    }
}

export class UserContextType {
    data: UserModel = new UserModel();
    pass: IPass = new IPass();
    listImage: string[] = [];
    loading: boolean = false;
    onUpdateAvatar = (image: string) => { };
    onUpdateBackground = (image: string) => { };
    onDeleteAvatar = () => { };
    onDeleteBackground = () => { };
    onUpdateInfo = () => { };
    onUpdatePass = () => { };
}

export const UserContext = React.createContext<UserContextType>(new UserContextType());

interface IProps {
    children: React.ReactNode
}



export const UserContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<UserModel>(new UserModel());
    const [listImage, setListImage] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { sessionStore } = useCoreStores();
    const [pass, setPass] = React.useState<IPass>(new IPass());

    const fetchData = async () => {
        setLoading(true)
        const res = await AuthApi.getProfile();
        setLoading(false)
        if (res.Status) {
            const use = new UserModel();
            Object.assign(use, res.Data.data);
            sessionStore.setProfile(use);
            sessionStore.setSession({ access_token: res.Data.data.access_token });
            setData(use);
        }
    }

    const onUpdateAvatar = async (image: string) => {
        const params = {
            avatar: image
        }
        await AuthApi.updateAvatar(params).then(res => {
            toast('Update avatar successfully')
            fetchData();
        })
            .catch(err => {
                toast('Update avatar failed')
            })
    }

    const onUpdateBackground = async (image: string) => {
        const params = {
            background: image
        }
        await AuthApi.updateBackground(params).then(res => {
            toast('Update background successfully')
            fetchData();
        })
            .catch(err => {
                toast('Update background failed')
            })
    }

    const onDeleteAvatar = async () => {
        await AuthApi.deleteAvatar().then(res => {
            toast('Delete avatar successfully')
            fetchData();
        })
            .catch(err => {
                toast('Delete avatar failed')
            })
    }

    const onDeleteBackground = async () => {
        await AuthApi.deleteBackground().then(res => {
            toast('Delete avatar successfully')
            fetchData();
        })
            .catch(err => {
                toast('Delete avatar failed')
            })
    }

    const onUpdateInfo = async () => {
        const params = {
            ...data,
        }
        showLoading();
        await AuthApi.updateInfo(params).then(res => {
            toast('Update info successfully')
            fetchData();
        }).catch(err => {
            toast('Update info failed')
        })
        hideLoading();
    }

    const validatePass = () => {
        pass.err_confirm_password = ''
        pass.err_new_password = ''
        pass.err_old_password = ''
        let isValid = true;
        if (!pass.old_password) {
            pass.err_old_password = 'Vui lòng nhập mật khẩu'
            isValid = false;
        }
        if (!pass.new_password) {
            pass.err_new_password = 'Vui lòng nhập mật khẩu mới'
            isValid = false;
        }
        if (!pass.confirm_password) {
            pass.err_confirm_password = 'Vui lòng nhập lại mật khẩu'
            isValid = false;
        }
        if (pass.new_password !== pass.confirm_password) {
            pass.err_confirm_password = 'Mật khẩu không khớp'
            isValid = false;
        }
        if (pass.old_password === pass.new_password) {
            pass.err_new_password = 'Mật khẩu đã được sử dụng'
            isValid = false;
        }
        return isValid
    }

    const onUpdatePass = async () => {
        if (!validatePass()) { return }
        const params = {
            ...pass
        }
        showLoading();
        await AuthApi.updatePassword(params).then(res => {
            toast('Update password successfully')
            setPass(new IPass())
        }).catch(err => {
            toast('Update password failed')
            pass.err_old_password = err.Message
        })
        hideLoading()
    }

    useEffect(() => {
        if (sessionStore.session?.access_token) {
            setToken(sessionStore.session?.access_token);
            fetchData();
        }
    }, [sessionStore.session?.access_token])

    return (
        <UserContext.Provider value={{
            data,
            pass,
            listImage,
            loading,
            onUpdateAvatar,
            onUpdateBackground,
            onDeleteAvatar,
            onDeleteBackground,
            onUpdateInfo,
            onUpdatePass
        }}>
            {children}
        </UserContext.Provider>
    )
})

export const useUserContext = () => {
    return React.useContext(UserContext);
}