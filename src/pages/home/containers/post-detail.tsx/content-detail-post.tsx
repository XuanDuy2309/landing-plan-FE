import { Dropdown, MenuProps } from "antd"
import classNames from "classnames"
import { observer } from "mobx-react"
import moment from "moment"
import { Colors } from "src/assets"
import { IconBase } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { formatMoney } from "src/core/base"
import { Purpose_Post, Type_Asset_Enum } from "src/core/models"
import { useUserContext } from "src/core/modules"
import { usePostDetailContext } from "src/core/modules/post"

export const ContentDetailPost = observer(() => {
    const { data } = usePostDetailContext()
    const { data: user } = useUserContext()
    const listOption: MenuProps['items'] = [
        {
            key: '2',
            label: 'Ẩn bài viết',
            onClick: () => {
            },
        },
        {
            key: '3',
            label: 'Liên hệ ngay',
            onClick: () => {
            },
        },
    ]

    const renderPurpose = {
        1: { label: "Bán", color: Colors.green[400] },
        2: { label: "Cho thuê", color: Colors.blue[400] },
        3: { label: "Đấu giá", color: Colors.red[400] },
    }

    const typeAssetPost = {
        1: { label: 'Nhà riêng', icon: 'user-outline' },
        2: { label: 'Đất', icon: 'user-outline' },
        3: { label: 'Căn hộ chung cư', icon: 'user-outline' },
        4: { label: 'Kho', icon: 'user-outline' },
        5: { label: 'Văn phòng', icon: 'user-outline' },
        6: { label: 'Nhà trọ', icon: 'user-outline' },
        7: { label: 'Khách sạn', icon: 'user-outline' },
        8: { label: 'Khác', icon: 'user-outline' },
    }

    const typeAlley = {
        1: { label: 'Trong hẻm', icon: 'user-outline' },
        2: { label: 'Mặt đường', icon: 'user-outline' },
    }
    const renderUnit = () => {
        if (data.purpose === Purpose_Post.For_Sell) {
            return 'VNĐ'
        }
        if (data.purpose === Purpose_Post.For_Rent) {
            return 'VNĐ/Tháng'
        }
        if (data.purpose === Purpose_Post.For_Auction) {
            return 'VNĐ'
        }
        return 'VNĐ'
    }

    const renderPrice = () => {
        if (data.purpose === Purpose_Post.For_Sell) {
            return data.price_for_buy
        }
        if (data.purpose === Purpose_Post.For_Rent) {
            return data.price_for_rent
        }
        if (data.purpose === Purpose_Post.For_Auction) {
            return data.price_start
        }
        return data.price_current
    }

    const directionLand = {
        1: { label: 'Bắc', icon: 'user-outline' },
        2: { label: 'Nam', icon: 'user-outline' },
        3: { label: 'Đông', icon: 'user-outline' },
        4: { label: 'Tây', icon: 'user-outline' },
        5: { label: 'Tây Bắc', icon: 'user-outline' },
        6: { label: 'Đông Bắc', icon: 'user-outline' },
        7: { label: 'Tây Nam', icon: 'user-outline' },
        8: { label: 'Tây Bắc', icon: 'user-outline' },
    }
    return (
        <div className="w-full h-full flex flex-col bg-white px-3 space-y-2">
            <div className="w-full flex-none flex items-center border-b py-3 space-x-2 border-gray-200 relative">
                <div className='size-10 flex-none rounded-full flex items-center bg-gray-200 justify-center overflow-hidden cursor-pointer hover:opacity-80'
                    onClick={() => {
                    }}
                >
                    {
                        data && data.create_by_avatar ?
                            <img src={data.create_by_avatar} alt="" className="size-full object-cover" />
                            :
                            <span className="text-2xl font-bold text-gray-900">{data.create_by_name?.charAt(0).toUpperCase()}</span>

                    }
                </div>
                <div className="w-full flex-col flex"
                    onClick={() => {
                    }}
                >
                    <span className="text-base font-medium text-gray-900">{data.create_by_name}</span>
                    <span>{data.create_at ? moment(data.create_at).format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                </div>
                <Dropdown trigger={["click"]} menu={{ items: listOption }}>
                    <div><ButtonIcon icon="more" size={'xxs'} color={Colors.gray[700]} /></div>
                </Dropdown>
            </div>
            <div className="w-full flex-none flex items-start space-x-2">
                <span className="text-sm flex-none font-medium px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: data.purpose ? renderPurpose[data.purpose].color : Colors.green[400] }}
                >{data.purpose ? renderPurpose[data.purpose].label : ''}</span>
                <span className="text-gray-900 font-bold text-base">{data.title}</span>
            </div>
            <div className="w-full flex items-center space-x-1 flex-wrap">
                <div className=" flex items-center space-x-2">
                    <IconBase icon='location-outline' size={16} color={Colors.gray[700]} />
                    <span>{data.address}</span>
                </div>
                <span>-</span>
                <span>{formatMoney(data.price_for_buy, 1, 'vn')} VND </span>
                <span>-</span>
                <span>{data.area} m2</span>
            </div>

            <div className="w-full h-full flex flex-col space-y-2">
                <span className="text-xl font-bold text-gray-900">Thông tin BĐS</span>
                <div className="w-full flex flex-col text-base text-gray-700 space-y-0.5">
                    <div className="w-full flex items-center space-x-2 ">
                        <span className=" w-[140px]">Loại tài sản:</span>
                        <span>{data.type_asset ? typeAssetPost[data.type_asset].label : ""}</span>
                    </div>
                    <div className="w-full flex items-center space-x-2 ">
                        <span className=" w-[140px]">Vị trí:</span>
                        <span>{data.in_alley ? typeAlley[data.in_alley].label : ""}</span>
                    </div>
                    <div className="w-full flex items-center space-x-2 ">
                        <span className=" w-[140px]">Diện tích:</span>
                        <span>{data.area} m2</span>
                    </div>
                    <div className="w-full flex items-center space-x-2 ">
                        <span className=" w-[140px]">Chiều dài:</span>
                        <span>{data.width} m</span>
                    </div>
                    <div className="w-full flex items-center space-x-2 ">
                        <span className=" w-[140px]">Chiều rộng:</span>
                        <span>{data.height} m</span>
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <span className=" w-[140px]">Giá:</span>
                        <span>{formatMoney(renderPrice(), 1, 'vn')} {renderUnit()}</span>
                    </div>
                    {
                        data.type_asset === Type_Asset_Enum.Apartment &&
                        <div className="w-full flex items-center space-x-2">
                            <span className=" w-[140px]">Số phòng:</span>
                            <span>{data.room_number}</span>
                        </div>
                    }
                    {
                        data.type_asset !== Type_Asset_Enum.Apartment &&
                        <div className="w-full flex items-center space-x-2 ">
                            <span className=" w-[140px]">Số tầng:</span>
                            <span>{data.number_floors} tầng</span>
                        </div>
                    }
                    <div className="w-full flex items-center space-x-2">
                        <span className=" w-[140px]">Số phòng ngủ:</span>
                        <span>{data.number_bedrooms} phòng</span>
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <span className=" w-[140px]">Số phòng tắm:</span>
                        <span>{data.number_bathrooms} phòng</span>
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <span className=" w-[140px]">Hướng đất:</span>
                        <span>{data.direction_land ? directionLand[data.direction_land].label : ""}</span>
                    </div>
                    {
                        data.purpose === Purpose_Post.For_Auction &&
                        <>
                            <div className="w-full flex items-center space-x-2">
                                <span className=" w-[140px]">Thời gian bắt đầu:</span>
                                <span>{data.date_start ? moment(data.date_start).format('DD/MM/YYYY') : '--/--/----'}</span>
                            </div>
                            <div className="w-full flex items-center space-x-2">
                                <span className=" w-[140px]">Thời gian kết thúc:</span>
                                <span>{data.date_end ? moment(data.date_end).format('DD/MM/YYYY') : '--/--/----'}</span>
                            </div>
                            <div className="w-full flex items-center space-x-2">
                                <span className=" w-[140px]">Giá khởi điểm:</span>
                                <span>{formatMoney(data.price_start, 1, 'vn')} VND</span>
                            </div>
                            <div className="w-full flex items-center space-x-2">
                                <span className=" w-[140px]">Giá hiện tại:</span>
                                <span>{formatMoney(data.price_current, 1, 'vn')} VND</span>
                            </div>
                        </>
                    }
                    <span>{data.description}</span>
                </div>
            </div>
            <div className="w-full flex items-center border-t space-x-2 border-gray-200 py-3">
                <div className={classNames("w-full h-10 flex items-center justify-center space-x-2 rounded hover:bg-gray-200 cursor-pointer",
                    { 'text-gray-700': !data.like_by_ids?.includes(user.id || 0) },
                    { 'text-blue-800': data.like_by_ids?.includes(user.id || 0) }
                )}
                    onClick={() => {
                        console.log(data.like_by_ids)
                        if (data.like_by_ids?.includes(user.id || 0)) {
                            data.like_by_ids = data.like_by_ids.filter(id => id !== user.id)
                            return
                        }
                        data.like_by_ids.push(user.id || 0)
                    }}
                >
                    <IconBase
                        icon={data.like_by_ids.includes(user.id || 0) ? 'like' : 'like-outline'}
                        size={20}
                        color={!data.like_by_ids.includes(user.id || 0) ? Colors.gray[700] : Colors.blue[600]} />
                    <span>Thích</span>
                </div>
                <div className="w-full h-10 flex items-center justify-center space-x-2 rounded hover:bg-gray-200 cursor-pointer">
                    <IconBase icon='share-outline' size={20} color={Colors.gray[700]} />
                    <span>Chia sẻ</span>
                </div>
            </div>
        </div>
    )
})