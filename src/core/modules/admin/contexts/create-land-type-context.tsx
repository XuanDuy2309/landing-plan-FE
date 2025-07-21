import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { LandingMapApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { LandingTypeModel } from "../../../models";
import { useListLandTypeContext } from "./list-land-type-context";

export class CreateLandTypeContextType {
    data: LandingTypeModel = new LandingTypeModel();
    onSubmit!: () => Promise<BaseResponse | undefined>
    onClear: () => void = () => { }
}

export const CreateLandTypeContext = React.createContext<CreateLandTypeContextType>(new CreateLandTypeContextType());

interface IProps {
    children: React.ReactNode
}

export const CreateLandTypeContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<LandingTypeModel>(new LandingTypeModel());
    const { itemUpdate, setItemUpdate, setCreate } = useListLandTypeContext()

    const isValid = () => {
        let isValid = true;
        data.err_name
        data.err_code
        data.err_color
        if (!data.name) {
            data.err_name = 'Vui lòng nhập tên loại đất';
            isValid = false
        }

        if (!data.code) {
            data.err_code = 'Vui lòng nhập mã loại đất';
            isValid = false
        }
        if (!data.color) {
            data.err_color = 'Vui lòng nhập màu loại đất';
            isValid = false
        }

        return isValid
    };



    const onSubmit = async () => {
        if (!isValid()) {
            console.log(data)
            return
        }
        const params = {
            "name": data.name,
            "color": data.color,
            "code": data.code
        };

        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }
        if (itemUpdate) {
            res = await LandingMapApi.updateLandType(data.id || 0, params);
            if (res.Status) {
                onClear()
            }
            return res
        }
        res = await LandingMapApi.createLandType(params);
        if (res.Status) {
            onClear()
        }
        return res
    }


    const onClear = () => {
        setData(new LandingTypeModel())
        setItemUpdate(undefined)
    }

    const initData = (itemUpdate: LandingTypeModel) => {
        const temp = new LandingTypeModel()
        Object.assign(temp, itemUpdate)
        setData(temp)
    }

    useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate)
        }
    }, [itemUpdate])

    return (
        <CreateLandTypeContext.Provider value={{ data, onSubmit, onClear }}>
            {children}
        </CreateLandTypeContext.Provider>
    )
})

export const useCreateLandTypeContext = () => {
    return React.useContext(CreateLandTypeContext);
}
