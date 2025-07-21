import { round } from "@turf/turf"
import { Dropdown, MenuProps, Slider } from "antd"
import classNames from "classnames"
import { observer } from "mobx-react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Colors } from "src/assets"
import { ButtonLoading, InputUnit } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { ModalConfirm } from "src/components/modal-confirm/modal-confim"
import { PostApi } from "src/core/api"
import { currencyFormat, currencyFormatToInt, formatMoney } from "src/core/base"
import { useSocketEvent } from "src/core/hook"
import { Purpose_Post } from "src/core/models"
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
    const [time, setTime] = useState<string>()

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

    const items2: MenuProps['items'] = [
        {
            key: 1,
            label: 'Nhắn tin',
            onClick: () => {
                navigate(`/home/message?user_id=${data.create_by_id}`);
            },
        },
        {
            key: 2,
            label: 'Gọi điện trực tiếp',
            onClick: () => {
                if (data.create_by_phone) {
                    window.location.href = `tel:${data.create_by_phone}`;
                } else {
                    toast.warning('Không có số điện thoại của người đăng');
                }
            },
        },
    ];

    const handleChangeSlider = (value: number) => {
        dataAuction.err_price = undefined
        const startPrice = ((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0)
        const maxPrice = ((data.bids[0]?.price ?? data.price_current) ?? 0) + (data?.max_bid ?? 0)
        const priceRange = maxPrice - startPrice

        dataAuction.price = round((value / 100) * priceRange, 2) + startPrice
    }

    useSocketEvent('bid_create', (data: any) => {
        if (data.user_id === sessionStore.profile?.id) {
            onRefresh()
            return
        }
        toast.info(data.message)
        onRefresh()
    })

    useEffect(() => {
        dataAuction.price = ((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0)
    }, [data.bids, data.price_current, data.bid_step])

    const [auctionStatus, setAuctionStatus] = useState<'not_started' | 'in_progress' | 'ended'>('not_started');

    const getCountdownText = (distance: number, prefix: string) => {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const time = moment.utc(distance).format("HH:mm:ss");
        return `${prefix} ${days > 0 ? `${days} ngày ` : ''}${time}`;
    };

    useEffect(() => {
        if (Number(data.purpose) !== Purpose_Post.For_Auction) return;

        const interval = setInterval(() => {
            const now = moment();
            const start = moment(data.start_date);
            const end = moment(data.end_date);

            if (now.isBefore(start)) {
                setAuctionStatus("not_started");
                const distance = start.diff(now);
                setTime(getCountdownText(distance, "Phiên đấu giá sẽ bắt đầu sau:"));
            } else if (now.isAfter(end)) {
                setAuctionStatus("ended");
                setTime("Phiên đấu giá đã kết thúc");
                clearInterval(interval);
            } else {
                setAuctionStatus("in_progress");
                const distance = end.diff(now);
                setTime(getCountdownText(distance, "Phiên đấu giá sẽ kết thúc sau:"));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [data.start_date, data.end_date, data.purpose]);

    return (

        <div className="w-full h-full flex flex-col p-3 overflow-y-auto space-y-3"
        >
            <div className="w-full flex flex-col p-3 rounded-xl bg-white">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Biểu đồ biến động giá</span>
                    <div className="flex items-center space-x-3">
                        <ButtonIcon icon="close-outline" iconSize="24" color={Colors.gray[500]} onClick={() => {
                            if (sessionStore.profile?.id === data.create_by_id || data.like_by_ids?.includes(sessionStore.profile?.id || 0)) {
                                navigate('/home')
                                return
                            }
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
                    <div className="w-full flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="w-[160px] text-start">Chủ sở hữu (dự kiến):</span>
                            <span>{data.bids[0] ? data.bids[0].user_name : '---'}</span>
                        </div>

                        {
                            moment().isAfter(data.end_date) && data.bids[0] && data.bids[0].user_id === sessionStore.profile?.id &&
                            <Dropdown trigger={["click"]} menu={{ items: items2 }}>
                                <div><ButtonLoading label="Liên hệ chủ đất" template="ActionBlue" size="xs" onClick={() => { }} /></div>
                            </Dropdown>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Đặt giá</span>
                    <span className="text-lg font-bold text-gray-900">{time}</span>

                </div>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <Slider
                        defaultValue={0}
                        className="w-[400px]"
                        value={((dataAuction.price || 0) - (((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0))) / ((((data.bids[0]?.price ?? data.price_current) ?? 0) + (data?.max_bid ?? 0)) - (((data.bids[0]?.price ?? data.price_current) ?? 0) + (data.bid_step ?? 0))) * 100}
                        onChange={value => handleChangeSlider(value)}
                        disabled={auctionStatus !== 'in_progress'}
                        tooltip={{
                            formatter: () => formatMoney(dataAuction.price, 1, 'vn') + ' VND',
                        }}
                    />
                    <div className={classNames("w-full flex flex-col space-y-2")}>
                        <div className="w-3/4">
                            <InputUnit label="Giá" value={currencyFormat(dataAuction.price)} onChange={value => { dataAuction.price = currencyFormatToInt(value) }}
                                unit="VND"
                                err={dataAuction.err_price}
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <ButtonLoading
                                label="Đặt giá"
                                template="ActionBlue"
                                size="xs"
                                onClick={() => {
                                    modalRef.current.open()
                                }}
                                disabled={auctionStatus !== 'in_progress' || data.create_by_id === sessionStore.profile?.id}
                                className="flex-none h-[42px]"
                            />
                            <ButtonLoading
                                label="Tối đa"
                                template="ActionOrange"
                                size="xs"
                                onClick={() => {
                                    dataAuction.price = (data.max_bid ?? 0) + ((data.bids[0]?.price || data.price_current) ?? 0)
                                }}
                                disabled={auctionStatus !== 'in_progress' || data.create_by_id === sessionStore.profile?.id}
                                className="flex-none h-[42px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {auctionStatus !== 'not_started' && <div className="w-full flex flex-col p-3 rounded-xl bg-white space-y-3">
                <div className="w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Lịch sử đặt giá</span>
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <span className="cursor-pointer">{sort === 1 ? 'Thời gian tạo: mới -> cũ' : 'Thời gian tạo: cũ -> mới'}</span>
                    </Dropdown>
                </div>
                <div className="w-full flex flex-col space-y-1 text-base text-gray-700">
                    <HistorySetBid data={data.bids} />
                </div>
            </div>}
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
                    if (res.Status) {
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