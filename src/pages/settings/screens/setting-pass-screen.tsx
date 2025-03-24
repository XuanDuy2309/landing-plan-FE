import { Spin } from "antd";
import { makeAutoObservable, set } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ButtonLoading, InputLabel } from "src/components";
import { useUserContext } from "src/core/modules";

export const SettingPassScreen = observer(() => {
    const { data, pass, loading, onUpdatePass } = useUserContext();

    return (<>
        {!data && loading ?
            <div className="w-full h-full flex items-center justify-center">
                <Spin />
            </div> :
            <div className="w-full p-4 ">
                <div className="w-full h-full bg-white flex flex-col rounded overflow-hidden">
                    <div className="w-full p-3 flex flex-col">
                        <span className="text-lg font-medium text-gray-700">Cập nhật mật khẩu</span>
                        <InputLabel
                            label="Mật khẩu hiện tại"
                            value={pass.old_password || ''}
                            onChange={(value) => { pass.old_password = value }}
                            placeholder="Nhập mật khẩu"
                            error={pass.err_old_password}
                            type="password"
                        />
                        <InputLabel
                            label="Mật khẩu mới"
                            value={pass.new_password || ''}
                            onChange={(value) => { pass.new_password = value }}
                            placeholder="Nhập mật khẩu"
                            error={pass.err_new_password}
                            type="password"
                        />
                        <InputLabel
                            label="Xác nhận mật khẩu"
                            value={pass.confirm_password || ''}
                            onChange={(value) => { pass.confirm_password = value }}
                            placeholder="Nhập lại mật khẩu mới"
                            error={pass.err_confirm_password}
                            type="password"
                        />
                        <div className="w-full p-3 flex items-center justify-end space-x-2">
                            <ButtonLoading label="Cập nhật" size="xs" template="ActionBlue" onClick={() => {
                                onUpdatePass();
                            }} />
                        </div>
                    </div>
                </div>
            </div>}
    </>)

})