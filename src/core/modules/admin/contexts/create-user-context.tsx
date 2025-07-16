import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { AuthApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { Status, UserModel } from "../../../models";
import { useListUserContext } from "../../user/context";

export class CreateAdminUserContextType {
    data: UserModel = new UserModel();
    onSubmit!: () => Promise<BaseResponse | undefined>
    onClear: () => void = () => { }
}

export const CreateAdminUserContext = React.createContext<CreateAdminUserContextType>(new CreateAdminUserContextType());

interface IProps {
    children: React.ReactNode
}

export const CreateAdminUserContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<UserModel>(new UserModel());
    const { itemUpdate, setItemUpdate, setCreate } = useListUserContext()

    const isValid = () => {
        let isValid = true;
        data.err_confirm_password = '';
        data.err_email = '';
        data.err_fullname = '';
        data.err_password = '';
        data.err_phone_number = '';
        data.err_username = '';
        if (!data.fullname) {
            data.err_fullname = 'Vui lòng nhập họ và tên';
            isValid = false
        }

        if (!data.phone_number) {
            data.err_phone_number = 'Vui lòng nhập số điện thoại';
            isValid = false
        }
        if (!data.username) {
            data.err_username = 'Vui lòng nhập tên đăng nhập';
            isValid = false
        }
        if (!data.password) {
            data.err_password = 'Vui lòng nhập mật khẩu';
            isValid = false
        }
        if (!data.confirm_password) {
            data.err_confirm_password = 'Vui lòng xác nhận mật khẩu';
            isValid = false
        }
        if (data.password !== data.confirm_password) {
            data.err_confirm_password = 'Mật khẩu xác nhận không khớp';
            isValid = false
        }
        return isValid
    };



    const onSubmit = async () => {
        if (!isValid()) {
            return
        }
        if (isValid() === false) {
            return;
        }
        const params = { ...data };

        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }

        if (itemUpdate) {
            res = await AuthApi.register(params);
            if (res.Status) {
                onClear()
            }
            return res
        }
        res = await AuthApi.register(params);
        if (res.Status) {
            onClear()
        }
        return res
    }


    const onClear = () => {
        setData(new UserModel())
        setItemUpdate(undefined)
        setCreate(false)
    }

    const initData = (itemUpdate: UserModel) => {
        const temp = new UserModel()
        Object.assign(temp, itemUpdate)
        temp.status = itemUpdate.status === Status.active ? Status.active : Status.inactive
        setData(temp)
    }

    useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate)
        }
    }, [itemUpdate])

    return (
        <CreateAdminUserContext.Provider value={{ data, onSubmit, onClear }}>
            {children}
        </CreateAdminUserContext.Provider>
    )
})

export const useCreateAdminUserContext = () => {
    return React.useContext(CreateAdminUserContext);
}
