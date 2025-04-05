import { observer } from "mobx-react"
import { InputLabel } from "../input-label"
import { IconBase } from "../icon-base"
import { Dropdown } from "antd"
import { useCreatePostContext } from "src/core/modules"
import { DatePickerAnt } from "../date-picker"

export const SettingAuction = observer(() => {
    const { data } = useCreatePostContext()
    return <div className="w-full flex flex-col space-y-2 px-3">
        <span className="text-xl font-medium text-gray-900">Thiết lập đấu giá:</span>
        <div className="flex flex-col space-y-1">
            <div className="w-full flex items-start space-x-2">
                <span className="w-[130px] flex-none text-end font-medium text-gray-700">Giá khởi điểm:</span>
                <div className="flex flex-col space-y-0.5">
                    <input type="text"
                        className="outline-none w-[100px] border-b border-gray-200 text-end"
                        value={data.price_start}
                        onChange={(e) => { data.price_start = e.target.value }}
                        placeholder="0"
                    />
                    {data.err_price_start && <span className="text-sm text-red-400">{data.err_price_start}</span>}
                </div>
                <span>VNĐ</span>
            </div>
            <div className="w-full flex items-start space-x-2">
                <span className="w-[130px] flex-none text-end font-medium text-gray-700">Bắt đầu từ:</span>
                <div className="flex flex-col space-y-0.5">
                    <DatePickerAnt format={"HH:mm DD/MM/YYYY"}
                        value={data.date_start}
                        onChange={(value) => {
                            data.date_start = value
                        }}
                        disableDate="before"
                        showTime="HH:mm"
                        placeholder="dd/mm/yyyy"
                    />
                    {data.err_date_start && <span className="text-sm text-red-400">{data.err_date_start}</span>}
                </div>
                <span>Đến</span>
                <div className="flex flex-col space-y-0.5">
                    <DatePickerAnt format={"HH:mm DD/MM/YYYY"}
                        value={data.date_end}
                        onChange={(value) => {
                            data.date_end = value
                        }}
                        disableDate="before"
                        showTime="HH:mm"
                        placeholder="dd/mm/yyyy"
                    />
                    {data.err_date_end && <span className="text-sm text-red-400">{data.err_date_end}</span>}
                </div>
            </div>
        </div>
    </div>
})