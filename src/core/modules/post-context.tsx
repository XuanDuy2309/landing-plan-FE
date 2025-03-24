import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../api";
import { PostModel } from "../models";

export class PostContextType {
    data: PostModel[] = [];
    loading: boolean = false
}

export const PostContext = React.createContext<PostContextType>(new PostContextType());

interface IProps {
    children: React.ReactNode
}

export const PostContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<PostModel[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true)
        // const res = await AuthApi.getListImage();
        setLoading(false)
        // if (res.Status) {
        //     setData(res.Data.data);
        // }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <PostContext.Provider value={{ data, loading }}>
            {children}
        </PostContext.Provider>
    )
})

export const usePostContext = () => {
    return React.useContext(PostContext);
}