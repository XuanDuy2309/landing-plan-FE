import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { IconBase } from "./icon-base";
import { Colors } from "src/assets";

interface IProps {
    value: string;
    onChange: (e) => void;
    error?: string;
    label?: string;
    type?: 'text' | 'password';
}

export const InputForm = ({ value, error, label, onChange, type }: IProps) => {
    const [editInput, setEditInput] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const ref = useRef<any>(null)

    useEffect(() => {
        if (error) {
            setEditInput(true)
            ref.current.focus()
        }
    }, [error])
    return (
        <div className="w-full justify-end flex flex-col group">
            <span className={`${editInput || value ? "text-lsm font-medium text-gray-700" : "translate-y-5 text-gray-500 text-md md:text-lg font-medium"} h-6 flex items-center transition-all duration-300`} onClick={() => { setEditInput(true); ref.current.focus() }}>{label}</span>
            <div className={classNames("w-full flex items-center border-b group-hover:border-green-100", { "border-red-400": error }, { 'border-green-900': editInput })}>
                <input className={classNames("outline-none w-full text-gray-500 text-lg font-medium")}
                    // placeholder={t("enter_search_infor") || ""}
                    type={!showPassword ? type : 'text'}
                    onChange={(e) => onChange(e)}
                    value={value}
                    onFocus={() => setEditInput(true)}
                    onBlur={() => setEditInput(false)}
                    autoFocus={editInput}
                    ref={ref}
                />
                {
                    type === 'password' &&
                    <div className="size-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50" onClick={() => setShowPassword(!showPassword)}>
                        <IconBase icon={!showPassword ? "show-outline" : "hide-outline"} size={16} color={Colors.gray[500]} />
                    </div>
                }
            </div>
        </div>
    )
};