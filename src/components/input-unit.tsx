import classNames from "classnames"
import { ButtonLoading } from "./Button"
import { IconBase } from "./icon-base"
import { Colors } from "src/assets"

interface IProps {
    label?: string
    className?: string
    onChange?: (value?: string) => void
    measure?: boolean
    value?: string | number | undefined
    unit?: string
    err?: string
}

export const InputUnit = ({ label, className, onChange, value, unit, err, measure }: IProps) => {
    return (
        <div className="w-full flex flex-col text-base">
            <div className="w-full flex items-center space-x-3">
                <span>{label}:</span>
                {measure &&
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <IconBase icon='location-outline' size={16} color={Colors.blue[600]} />
                        <span className="text-blue-600">Đo trên bản đồ</span>
                    </div>
                }
            </div>
            <div className={classNames("w-full flex items-center border rounded-md py-2"
                , { "border-red-400": err }
                , { "border-gray-500": !err }
            )
            }
            >
                <input type="text"
                    placeholder="0"
                    value={value}
                    onChange={(e) => {
                        onChange && onChange(e.target.value)
                    }}
                    className={classNames(
                        'px-3 outline-none w-full'
                    )}
                />
                {unit && <span className="px-3 h-full border-l">{unit}</span>}
            </div>
            {
                err && <span className="text-red-400 text-sm">{err}</span>
            }
        </div>
    );
};