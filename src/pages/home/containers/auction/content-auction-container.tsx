import { round } from "@turf/turf"
import { Dropdown, MenuProps, Slider } from "antd"
import { observer } from "mobx-react"
import moment from "moment"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Colors } from "src/assets"
import { ButtonLoading, InputUnit } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { ModalConfirm } from "src/components/modal-confirm/modal-confim"
import { PostApi } from "src/core/api"
import { currencyFormat, currencyFormatToInt, formatMoney } from "src/core/base"
import { useSocketEvent } from "src/core/hook"
import { usePostDetailContext } from "src/core/modules/post"
import { hideLoading, showLoading } from "src/core/services"
import { useCoreStores } from "src/core/stores"
import { ChartBids } from "./chart-bids"
import { HistorySetBid } from "./history-set-bid-contaner"

export const ContentAuctionContainer = observer(() => {
    const { data, zoom, dataAuction, setZoom, setBid, onRefresh } = usePostDetailContext()
    const navigate = useNavigate()
    const [sort, setSort] = useState<number>(1)
    const modalRef = useRef<any>(null)
    const modalRef2 = useRef<any>(null)
    const { sessionStore } = useCoreStores()

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
        const startPrice = ((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0)
        const maxPrice = ((data.bids[0]?.price ?? data.price_current) ?? 0) + (data?.max_bid ?? 0)
        const priceRange = maxPrice - startPrice

        dataAuction.price = round((value / 100) * priceRange, 2) + startPrice
    }

    useSocketEvent('bid_create', (data: any) => {
        console.log("alo", data.user_id === sessionStore.profile?.id)
        if (data.user_id === sessionStore.profile?.id) {
            onRefresh()
            return
        }
        toast.info(data.message)
        onRefresh()
    })

    return (

        <div className="w-full h-full flex flex-col p-3 overflow-y-auto space-y-3"
        >
            <div className="w-full flex flex-col p-3 rounded-xl bg-white">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Biểu đồ biến động giá</span>
                    <div className="flex items-center space-x-3">
                        <ButtonIcon icon="close-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                            modalRef2.current.open()
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
                        <span>{data.start_date ? moment(data.start_date).format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                        <span>-</span>
                        <span>{data.end_date ? moment(data.end_date).format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                    </div>
                    <div className="w-full flex items-center space-x-5">
                        <div className="flex items-center space-x-2 w-[300px] flex-none">
                            <span className="w-[160px] text-start">Giá khởi điểm:</span>
                            <span>{formatMoney(data.price_start, 1, 'vn') + ' VND'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-[160px] text-start">Giá hiện tại:</span>
                            <span>{data.bids[0] ? formatMoney(data.bids[0]!.price, 1, 'vn') + ' VND' : (formatMoney(data.price_start, 1, 'vn') + ' VND')}</span>
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
                        <span>{data.bids[0] ? data.bids[0].user_name : ''}</span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <span className="text-lg font-bold text-gray-900">Đặt giá</span>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <Slider
                        defaultValue={0}
                        className="w-[400px]"
                        value={((dataAuction.price || 0) - (((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0))) / ((((data.bids[0]?.price ?? data.price_current) ?? 0) + (data?.max_bid ?? 0)) - (((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0))) * 100}
                        onChange={value => handleChangeSlider(value)}
                        tooltip={{
                            formatter: () => formatMoney(dataAuction.price, 1, 'vn') + ' VND',
                        }}
                    />
                    <div className="w-full flex items-end space-x-2">
                        <InputUnit label="Giá" value={currencyFormat(dataAuction.price)} onChange={value => { dataAuction.price = currencyFormatToInt(value) }}
                            unit="VND"
                        />
                        <ButtonLoading label="Đặt giá" template="ActionBlue" size="xs" onClick={() => {
                            modalRef.current.open()
                        }} className="flex-none h-[42px]" />
                        <ButtonLoading label="Tối đa" template="ActionOrange" size="xs" onClick={() => {
                            dataAuction.price = (data.max_bid ?? 0) + ((data.bids[0].price || data.price_current) ?? 0)
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
            <ModalConfirm
                ref={modalRef}
                label={"Xác nhận đặt giá " + formatMoney(dataAuction.price, 1, 'vn') + " VND"}
                centered
                onCancel={() => {
                    modalRef.current.close()
                }
                }
                onConfirm={async () => {
                    modalRef.current.close()
                    showLoading()
                    const res = await setBid()
                    hideLoading()
                    console.log(res)
                    if (res.Status) {
                        console.log("alo")
                        onRefresh()
                        toast.success("Đặt giá thành công")
                        return
                    }
                    toast(res.Message)
                }
                }
            />
            <ModalConfirm
                ref={modalRef2}
                label={"Bạn có có muốn nhận thông báo khi có người đặt giá?"}
                centered
                onCancel={() => {
                    modalRef2.current.close()
                    navigate('/home')
                }
                }
                onConfirm={async () => {
                    modalRef2.current.close()
                    showLoading()
                    const res = await PostApi.likePost({ id: data.id })
                    hideLoading()
                    if (res.Status) {
                        navigate('/home')
                        return
                    }
                    toast(res.Message)
                }
                }
            />
        </div>
    )
}
)