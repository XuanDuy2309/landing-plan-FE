import React, { use, useEffect } from "react";
import { UserModel } from "../models";
import { AuthApi } from "../api";
import { toast } from "react-toastify";
import { SessionStore, useCoreStores } from "../stores";
import { setToken } from "../config";

export class UserContextType {
    data: UserModel = new UserModel();
    listImage: string[] = [];
    loading: boolean = false;
    onUpdateAvatar = (image: string) => { };
    onUpdateBackground = (image: string) => { };
    onDeleteAvatar = () => { };
    onDeleteBackground = () => { };
}

export const UserContext = React.createContext<UserContextType>(new UserContextType());

interface IProps {
    children: React.ReactNode
}

export const UserContextProvider = ({ children }: IProps) => {
    const [data, setData] = React.useState<UserModel>(new UserModel());
    const [listImage, setListImage] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { sessionStore } = useCoreStores();

    const fetchData = async () => {
        setLoading(true)
        const res = await AuthApi.getProfile();
        setLoading(false)
        if (res.Status) {
            console.log('ressss', res.Data.data)
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

    useEffect(() => {
        if (sessionStore.session?.access_token) { 
            setToken(sessionStore.session?.access_token);
            fetchData(); }
    }, [sessionStore.session?.access_token])

    return (
        <UserContext.Provider value={{
            data,
            listImage,
            loading,
            onUpdateAvatar,
            onUpdateBackground,
            onDeleteAvatar,
            onDeleteBackground
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return React.useContext(UserContext);
}