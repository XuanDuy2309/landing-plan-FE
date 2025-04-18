import { observer } from "mobx-react"
import { InputUnit } from "../input-unit"
import { useCreatePostContext } from "src/core/modules"
import { InputLabel } from "../input-label"
import { IconBase } from "../icon-base"
import { Colors } from "src/assets"
import { Purpose_Post } from "src/core/models"
import { currencyFormat, currencyFormatToInt } from "src/core/base"

export const AreaAndPriceAsset = observer(() => {
    const { data } = useCreatePostContext()
    return (
        <div className="w-full h-full flex flex-col space-y-2 px-3">
            <span className="text-xl font-medium text-gray-900">Diện tích và vị trí:</span>
            <div className="w-full flex flex-col space-y-1">
                <div className="w-full flex flex-col space-x-1">
                    <div className="w-full flex items-center space-x-2">
                        <span className="text-base font-medium text-gray-700">Vị trí:</span>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <IconBase icon='location-outline' size={16} color={Colors.blue[600]} />
                            <span className="text-blue-600">Chọn trên bản đồ</span>
                        </div>
                    </div>

                    <div className="w-full flex items-center space-x-2">
                        <InputLabel
                            label="Long"
                            value={data.lng}
                            onChange={(value) => {
                                data.lng = value
                            }}
                            placeholder="0"
                            labelClassName="!w-[60px]"
                            error={data.err_lng}
                        />
                        <InputLabel
                            label="Lat"
                            value={data.lat}
                            onChange={(value) => {
                                data.lat = value
                            }}
                            placeholder="0"
                            labelClassName="!w-[60px]"
                            error={data.err_lat}
                        />
                    </div>
                </div>
                <div className="w-full flex items-start space-x-2">
                    <span className="text-base font-medium text-gray-700">Đường bao:</span>
                    <div className="flex flex-col space-x-0.5">
                        {!data.coordinates ?
                            <div className="flex items-center space-x-2 cursor-pointer">
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
                        data.area = value
                    }}
                    measure
                    err={data.err_area}
                />
                <div className="w-full flex items-center space-x-2">
                    <InputUnit
                        label="Chiều dài"
                        unit={'m'}
                        value={data.width}
                        onChange={(value) => {
                            data.width = value
                        }}
                        measure
                        err={data.err_width}
                    />
                    <InputUnit
                        label="Chiều rộng"
                        unit={'m'}
                        value={data.height}
                        onChange={(value) => {
                            data.height = value
                        }}
                        measure
                        err={data.err_height}
                    />
                </div>
                {data.purpose == Purpose_Post.For_Sell && <InputUnit
                    label="Tổng giá bán nguyên căn (lô)"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_for_buy)}
                    onChange={(value) => {
                        data.price_for_buy = currencyFormatToInt(value)
                    }}
                    err={data.err_price_for_buy}
                />}
                {data.purpose == Purpose_Post.For_Rent && <InputUnit
                    label="Tổng giá thuê nguyên căn (lô)/tháng"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_for_rent)}
                    onChange={(value) => {
                        data.price_for_rent = currencyFormatToInt(value)
                    }}
                    err={data.err_price_for_rent}
                />}
                {data.purpose === Purpose_Post.For_Auction && <InputUnit
                    label="Giá khởi điểm"
                    unit={'VNĐ'}
                    value={currencyFormat(data.price_start)}
                    onChange={(value) => {
                        data.price_start = currencyFormatToInt(value)
                    }}
                />}
                {data.purpose === Purpose_Post.For_Auction && <div className="w-full flex items-center space-x-2">
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
                    />
                </div>}
            </div>
        </div>
    )
})