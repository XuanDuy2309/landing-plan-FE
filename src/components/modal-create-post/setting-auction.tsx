import { observer } from "mobx-react"
import moment from "moment"
import { useCreatePostContext } from "src/core/modules"
import { DatePickerAnt } from "../date-picker"

export const SettingAuction = observer(() => {
    const { data } = useCreatePostContext()
    return <div className="w-full flex flex-col space-y-2 px-3">
        <span className="text-xl font-medium text-gray-900">Thiết lập đấu giá:</span>
        <div className="flex flex-col space-y-1">
            <div className="w-full flex items-start space-x-2">
                <span className="w-[130px] flex-none text-end font-medium text-gray-700">Bắt đầu từ:</span>
                <div className="flex flex-col space-y-0.5">
                    <DatePickerAnt format={"HH:mm DD/MM/YYYY"}
                        value={data.start_date ? moment(data.start_date) : undefined}
                        onChange={(value) => {
                            data.start_date = value?.format('YYYY-MM-DD HH:mm:ss')
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
                        value={data.end_date ? moment(data.end_date) : undefined}
                        onChange={(value) => {
                            data.end_date = value?.format('YYYY-MM-DD HH:mm:ss')
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