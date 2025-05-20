import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { AuthApi } from "src/core/api";
import { BaseResponse } from "src/core/config";

export class ImageContextType {
    data: any = [];
    dataVideo: any = [];
    loading: boolean = false
    onUpload = (file: File, type?: string) => { }
}

export const ImageContext = React.createContext<ImageContextType>(new ImageContextType());

interface IProps {
    children: React.ReactNode
    id?: number
}

export const ImageContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<any>([]);
    const [dataVideo, setDataVideo] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true)
        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }
        if (id) {
            res = await AuthApi.getListUploadById({ type: 'image', id });
        } else {
            res = await AuthApi.getListUpload({ type: 'image' });
        }
        setLoading(false)
        if (res.Status) {
            setData(res.Data.data);
        }
    }

    const fetchDataVideo = async () => {
        setLoading(true)
        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }
        if (id) {
            res = await AuthApi.getListUploadById({ type: 'video', id });
        } else {
            res = await AuthApi.getListUpload({ type: 'video' });
        }
        setLoading(false)
        if (res.Status) {
            setDataVideo(res.Data.data);
        }
    }

    const onUpload = async (file: File, type?: string) => {
        const form = new FormData();
        form.append('files', file, file.name);
        form.append('type', type || 'image');
        const res = await AuthApi.upload(form);
        if (res.Status) {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
        fetchDataVideo();
    }, [])

    return (
        <ImageContext.Provider value={{ data, dataVideo, loading, onUpload }}>
            {children}
        </ImageContext.Provider>
    )
})

export const useImageContext = () => {
    return React.useContext(ImageContext);
}