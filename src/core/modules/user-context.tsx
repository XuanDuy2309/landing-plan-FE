import React, { use, useEffect } from "react";
import { UserModel } from "../models";
import { AuthApi } from "../api";
import { toast } from "react-toastify";
import { SessionStore, useCoreStores } from "../stores";

export class UserContextType {
    data: UserModel = new UserModel();
    listImage: string[] = [];
    loading: boolean = false;
    onUpdateAvatar = (image: string) => { };
    onUpdateBackground = (image: string) => { };
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
            const use = new UserModel();
            Object.assign(use, res.Data.data);
            if (sessionStore.profile) { Object.assign(sessionStore.profile, res.Data.data); }
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

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <UserContext.Provider value={{ data, listImage, loading, onUpdateAvatar, onUpdateBackground }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return React.useContext(UserContext);
}