import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../api";
import { PostModel } from "../models";

export class CreatePostContextType {
    data: PostModel = new PostModel();
    loading: boolean = false
}

export const CreatePostContext = React.createContext<CreatePostContextType>(new CreatePostContextType());

interface IProps {
    children: React.ReactNode
}

export const CreatePostContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<PostModel>(new PostModel());
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true)
        // const res = await AuthApi.getListImage();
        setLoading(false)
        // if (res.Status) {
        //     setData(res.Data.data);
        // }
    }

    return (
        <CreatePostContext.Provider value={{ data, loading }}>
            {children}
        </CreatePostContext.Provider>
    )
})

export const useCreatePostContext = () => {
    return React.useContext(CreatePostContext);
}