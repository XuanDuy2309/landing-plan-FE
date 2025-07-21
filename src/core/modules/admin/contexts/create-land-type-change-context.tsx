import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { LandingMapApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { LandTypeChangeModel } from "src/core/models";
import { useLandTypeChangeContext } from "./list-land-type-change-context";

export class CreateLandTypeChangeContextType {
    data: LandTypeChangeModel = new LandTypeChangeModel();
    onSubmit!: () => Promise<BaseResponse | undefined>
    onClear: () => void = () => { }
}

export const CreateLandTypeChangeContext = React.createContext<CreateLandTypeChangeContextType>(new CreateLandTypeChangeContextType());

interface IProps {
    children: React.ReactNode
}

export const CreateLandTypeChangeContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<LandTypeChangeModel>(new LandTypeChangeModel());
    const { itemUpdate, setItemUpdate, setCreate } = useLandTypeChangeContext()

    const isValid = () => {
        let isValid = true;
        data.err_condinates
        data.err_land_type_id
        if (!itemUpdate && !data.condinates) {
            data.err_condinates = 'Vui lòng xác định đường ranh';
            isValid = false
        }

        if (!data.land_type_id) {
            data.err_land_type_id = 'Vui lòng chọn loại đất';
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
            "bounds": data.condinates,
            "land_type_id": data.land_type_id,
            "status": data.status,
        };

        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }
        if (itemUpdate) {
            res = await LandingMapApi.updateLandTypeChange(data.id || 0, params);
            if (res.Status) {
                onClear()
            }
            return res
        }
        res = await LandingMapApi.createLandTypeChange(params);
        if (res.Status) {
            onClear()
        }
        return res
    }


    const onClear = () => {
        setData(new LandTypeChangeModel())
        setItemUpdate(undefined)
    }

    const initData = (itemUpdate: LandTypeChangeModel) => {
        const temp = new LandTypeChangeModel()
        Object.assign(temp, itemUpdate)
        setData(temp)
    }

    useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate)
        }
    }, [itemUpdate])

    return (
        <CreateLandTypeChangeContext.Provider value={{ data, onSubmit, onClear }}>
            {children}
        </CreateLandTypeChangeContext.Provider>
    )
})

export const useCreateLandTypeChangeContext = () => {
    return React.useContext(CreateLandTypeChangeContext);
}
