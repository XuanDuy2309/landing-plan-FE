import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../api";

export class ImageContextType {
    data: any = [];
    loading: boolean = false
    onUpload = (file: File) => { }
}

export const ImageContext = React.createContext<ImageContextType>(new ImageContextType());

interface IProps {
    children: React.ReactNode
}

export const ImageContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true)
        const res = await AuthApi.getListImage();
        setLoading(false)
        if (res.Status) {
            setData(res.Data.data);
        }
    }

    const onUpload = async (file: File) => {
        const form = new FormData();
        form.append('image', file, file.name);
        const res = await AuthApi.uploadImage(form);
        if (res.Status) {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <ImageContext.Provider value={{ data, loading, onUpload }}>
            {children}
        </ImageContext.Provider>
    )
})

export const useImageContext = () => {
    return React.useContext(ImageContext);
}