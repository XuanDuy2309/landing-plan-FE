import { observer } from "mobx-react"
import { Colors } from "src/assets"
import { currencyFormat, currencyFormatToInt } from "src/core/base"
import { Purpose_Post } from "src/core/models"
import { ActionMap, useCreatePostContext } from "src/core/modules"
import { IconBase } from "../icon-base"
import { InputLabel } from "../input-label"
import { InputUnit } from "../input-unit"

export const AreaAndPriceAsset = observer(() => {
    const { data, setOpenMap, openMap, setMessage, message, setAction } = useCreatePostContext()
    const handleShowMap = () => {
        setOpenMap(true)
        setMessage('Tìm kiếm và "Chọn trên bản đồ" vị trí BDS của bạn.')
        setAction(ActionMap.Select_location)
    }
    return (
        <div className="w-full h-full flex flex-col space-y-2 px-3">
            <span className="text-xl font-medium text-gray-900">Diện tích và vị trí:</span>
            {!openMap && <div className="w-full flex flex-col space-y-1">
                <div className="w-full flex flex-col space-x-1">
                    <div className="w-full flex items-center space-x-2 flex-wrap">
                        <span className="text-base font-medium text-gray-700 flex-none">Vị trí:</span>
                        {data.address && <span className="line-clamp-1">{data.address}</span>}
                        <div className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => {
                                handleShowMap()
                            }}
                        >
                            <IconBase icon='location-outline' size={16} color={Colors.blue[600]} />
                            <span className="text-blue-600">{data.address ? "Chọn lại" : "Chọn trên bản đồ"}</span>
                        </div>
                    </div>

                    <div className="w-full flex items-center space-x-2">
                        <InputLabel
                            label="Long"
                            value={data.lng || ""}
                            onChange={(value) => {
                                data.lng = value ? Number(value) : undefined
                            }}
                            placeholder="0"
                            labelClassName="!w-[60px]"
                            error={data.err_lng}
                        />
                        <InputLabel
                            label="Lat"
                            value={data.lat || ""}
                            onChange={(value) => {
                                data.lat = value ? Number(value) : undefined
                            }}
                            placeholder="0"
                            labelClassName="!w-[60px]"
                            error={data.err_lat}
                        />
                    </div>
                </div>
                <div className="w-full flex items-start space-x-2">
                    <span className="text-base font-medium text-gray-700">Đường bao:</span>
                    <div className="flex flex-col space-x-0.5 cursor-pointer" onClick={() => {
                        handleShowMap()
                    }}>
                        {!data.coordinates ?
                            <div className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => setOpenMap(true)}>
                                <IconBase icon='location-outline' size={16} color={Colors.blue[600]} />
                                <span className="text-blue-600">Thêm đường bao</span>
                            </div>
                            :
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <IconBase icon='edit-outline' size={16} color={Colors.blue[600]} />
                                <span className="text-blue-600">Sửa đường bao</span>
                            </div>
                        }
                        {data.err_coordinate && <span className="text-red-400">{data.err_coordinate}</span>}
                    </div>
                </div>
                <InputUnit
                    label="Diện Tích"
                    unit={'m2'}
                    value={data.area ? data.area.toString() : ''}
                    onChange={(value) => {
                        data.area = value ? Number(value) : undefined
                    }}
                    measure
                    err={data.err_area}
                    onMeasure={handleShowMap}
                />
                <InputUnit
                    label="Tổng giá bán nguyên căn (lô)"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_for_buy)}
                    onChange={(value) => {
                        data.price_for_buy = currencyFormatToInt(value)
                    }}
                    err={data.err_price_for_buy}
                />
                {Number(data.purpose) == Purpose_Post.For_Rent && <InputUnit
                    label="Tổng giá thuê nguyên căn (lô)/tháng"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_for_rent)}
                    onChange={(value) => {
                        data.price_for_rent = currencyFormatToInt(value)
                    }}
                    err={data.err_price_for_rent}
                />}
                {Number(data.purpose) === Purpose_Post.For_Auction && <InputUnit
                    label="Giá khởi điểm"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_start)}
                    onChange={(value) => {
                        data.price_start = currencyFormatToInt(value)
                    }}
                    err={data.err_price_start}
                />}
                {Number(data.purpose) === Purpose_Post.For_Auction && <div className="w-full flex items-center space-x-2">
                    <InputUnit
                        label="Bước giá"
                        unit={'VNĐ'}
                        value={currencyFormat(data.bid_step)}
                        onChange={(value) => {
                            data.bid_step = currencyFormatToInt(value)
                        }}
                        err={data.err_step_bid}
                    />
                    <InputUnit
                        label="Bước giá tối đa"
                        unit={'VNĐ'}
                        value={currencyFormat(data.max_bid)}
                        onChange={(value) => {
                            data.max_bid = currencyFormatToInt(value)
                        }}
                        err={data.err_max_bid}
                    />
                </div>}
            </div>}

        </div>
    )
})
