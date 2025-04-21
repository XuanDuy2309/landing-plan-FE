import { observer } from "mobx-react"
import { use, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Colors } from "src/assets"
import { ButtonIcon } from "src/components/button-icon"
import { usePostDetailContext } from "src/core/modules/post"
import { ChartBids } from "./chart-bids"
import { ButtonLoading, InputUnit } from "src/components"
import { currencyFormat, currencyFormatToInt, formatMoney } from "src/core/base"
import { Dropdown, MenuProps, Slider } from "antd"
import { round } from "@turf/turf"
import { HistorySetBid } from "./history-set-bid-contaner"

export const ContentAuctionContainer = observer(() => {
    const { data, zoom, dataAuction, setZoom } = usePostDetailContext()
    const navigate = useNavigate()
    const [sort, setSort] = useState<number>(1)

    const items: MenuProps['items'] = [
        {
            key: 1,
            label: 'Thời gian tạo: mới -> cũ',
            onClick: () => {
                setSort(1)
            },
        },
        {
            key: 2,
            label: 'Thời gian tạo: cũ -> mới',
            onClick: () => {
                setSort(2)
            },
        },
    ];

    const handleChangeSlider = (value: number) => {
        const priceRange = (data?.max_bid ?? 0) - (data.bid_step ?? 0)
        dataAuction.price = round((value / 100) * priceRange, 2) + ((data.bids?.at(-1)?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0)
    }
    useEffect(() => {
        dataAuction.price = ((data.bids?.at(-1)?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0)
    }, [])

    return (

        <div className="w-full h-full flex flex-col p-3 overflow-y-auto space-y-3"
        >
            <div className="w-full flex flex-col p-3 rounded-xl bg-white">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Biểu đồ biến động giá</span>
                    <div className="flex items-center space-x-3">
                        <ButtonIcon icon="close-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                            navigate(-1)
                        }}
                        />
                        <ButtonIcon icon={zoom ? 'zoomout-outline' : 'zoomin-outline'} iconSize="24" color={Colors.gray[500]} onClick={() => {
                            setZoom(!zoom)
                        }}
                        />
                    </div>
                </div>
                <div className=" w-full px-3">
                    <ChartBids />
                </div>
            </div>
            <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <span className="text-lg font-bold text-gray-900">Thông tin phiên đấu giá</span>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <div className="w-full flex items-center space-x-2">
                        <span className="w-[160px] text-start">Thời gian diễn ra:</span>
                        <span>{data.date_start ? data.date_start.format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                        <span>-</span>
                        <span>{data.date_end ? data.date_end.format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                    </div>
                    <div className="w-full flex items-center space-x-5">
                        <div className="flex items-center space-x-2 w-[300px] flex-none">
                            <span className="w-[160px] text-start">Giá khởi điểm:</span>
                            <span>{formatMoney(data.price_start, 1, 'vn') + ' VND'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-[160px] text-start">Giá hiện tại:</span>
                            <span>{data.bids.at(-1) ? formatMoney(data.bids.at(-1)!.price, 1, 'vn') + ' VND' : (data.price_current + ' VND')}</span>
                        </div>
                    </div>
                    <div className="w-full flex items-center space-x-5">
                        <div className="flex items-center space-x-2 w-[300px] flex-none">
                            <span className="w-[160px] text-start">Bước giá:</span>
                            <span>{formatMoney(data.bid_step, 1, 'vn') + ' VND'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-[160px] text-start">Bước giá tối đa:</span>
                            <span>{formatMoney(data.max_bid, 1, 'vn') + ' VND'}</span>
                        </div>
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <span className="w-[160px] text-start">Chủ sở hữu (dự kiến):</span>
                        <span>{data.bids.at(-1) ? data.bids.at(-1)!.create_by_name : ''}</span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <span className="text-lg font-bold text-gray-900">Đặt giá</span>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <Slider
                        defaultValue={0}
                        className="w-[400px]"
                        value={((dataAuction.price ?? 0) - ((data.bids?.at(-1)?.price ?? data.price_current) ?? 0)) / (data.max_bid ?? 0) * 100}
                        onChange={value => { handleChangeSlider(value) }}
                        tooltip={{ formatter: () => { return formatMoney(dataAuction.price, 1, 'vn') + ' VND' } }}
                    />
                    <div className="w-full flex items-end space-x-2">
                        <InputUnit label="Giá" value={currencyFormat(dataAuction.price)} onChange={value => { dataAuction.price = currencyFormatToInt(value) }}
                            unit="VND"
                        />
                        <ButtonLoading label="Đặt giá" template="ActionBlue" size="xs" onClick={() => { }} className="flex-none h-[42px]" />
                        <ButtonLoading label="Tối đa" template="ActionOrange" size="xs" onClick={() => {
                            dataAuction.price = (data.max_bid ?? 0) + ((data.bids?.at(-1)?.price ?? data.price_current) ?? 0)
                        }} className="flex-none h-[42px]"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Lịch sử đặt giá</span>
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <span className="cursor-pointer">{sort === 1 ? 'Thời gian tạo: mới -> cũ' : 'Thời gian tạo: cũ -> mới'}</span>
                    </Dropdown>
                </div>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <HistorySetBid data={data.bids} />
                </div>
            </div>
        </div>
    )
}
)