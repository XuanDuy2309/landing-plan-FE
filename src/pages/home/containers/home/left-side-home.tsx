import classNames from "classnames"
import { observer } from "mobx-react"
import { useEffect, useRef, useState } from "react"
import { Collapse, UnmountClosed } from "react-collapse"
import { Colors } from "src/assets"
import { ButtonLoading, InputUnit } from "src/components"
import { ButtonIcon } from "src/components/button-icon"
import { Purpose_Post, Type_Asset_Enum } from "src/core/models"
import { usePostContext } from "src/core/modules"

export const LeftSideHome = observer(() => {
    const [show, setShow] = useState<boolean>(true)
    const { filter, onRefresh } = usePostContext()
    const [maxHeight, setMaxHeight] = useState<number>()

    const listPurpose = [
        {
            id: 1,
            name: 'Bán',
            value: Purpose_Post.For_Sell
        },
        {
            id: 2,
            name: 'Cho thuê',
            value: Purpose_Post.For_Rent
        },
        {
            id: 3,
            name: 'Đấu giá',
            value: Purpose_Post.For_Auction
        },
    ]

    const listTypeAsset = [
        {
            key: Type_Asset_Enum.Home,
            label: 'Nhà riêng'
        },

        {
            key: Type_Asset_Enum.Land,
            label: 'Đất'
        },

        {
            key: Type_Asset_Enum.Apartment,
            label: 'Căn hộ chung cư'
        },

        {
            key: Type_Asset_Enum.Warehouse,
            label: 'Kho'
        },

        {
            key: Type_Asset_Enum.Office,
            label: 'Văn phòng'
        },

        {
            key: Type_Asset_Enum.Motel,
            label: 'Nhà trọ'
        },

        {
            key: Type_Asset_Enum.Hotel,
            label: 'Khách sạn'
        },

        {
            key: Type_Asset_Enum.Other,
            label: 'Khác'
        },
    ]

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className={classNames("w-full flex flex-col justify-start items-center gap-2 bg-white rounded-xl max-h-full min-h-0",
            )}>
                <div className="w-full flex-none flex items-center space-x-2 px-3 py-2">
                    <ButtonIcon icon={show ? 'filter' : 'filter-outline'} iconSize={'24'} size={'medium'} color={Colors.gray[700]} onClick={() => setShow(!show)} />
                    <span className="text-xl font-bold text-gray-900">Bộ lọc</span>
                </div>
                <div className="w-full h-full flex flex-col px-3 py-2 space-y-3"
                    style={{
                        maxHeight: maxHeight,
                        overflowY: 'auto',
                    }}
                >
                    <div className="w-full flex items-center rounded-full bg-gray-200">
                        <ButtonIcon icon="search-outline" iconSize={'16'} size={'medium'} color={Colors.gray[700]} />
                        <input type="text"
                            value={filter.query}
                            onChange={(e) => { filter.query = e.target.value }}
                            placeholder="Tìm kiếm"
                            className="w-full outline-none bg-transparent"
                        />
                    </div>
                    <div className="w-full flex flex-col space-y-2">
                        <span className="text-base font-medium text-gray-700">Mục đích đăng bài:</span>
                        <div className="w-full flex items-center gap-1 flex-wrap">
                            {
                                listPurpose.map((item, index) => {
                                    return (
                                        <div key={index} className={classNames("px-3 py-2  flex items-center justify-center space-x-2 rounded-full  cursor-pointer hover:bg-blue-100 text-blue-800",
                                            { 'bg-gray-200 text-gray-700': filter.purpose.indexOf(item.value) < 0 },
                                            { 'bg-blue-100 text-blue-800': filter.purpose.indexOf(item.value) >= 0 },
                                        )}
                                            onClick={() => {
                                                if (filter.purpose.indexOf(item.value) >= 0) {
                                                    filter.purpose.splice(filter.purpose.indexOf(item.value), 1)
                                                } else {
                                                    filter.purpose.push(item.value)
                                                }
                                            }}
                                        >
                                            <span className="text-base font-medium ">{item.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="w-full flex flex-col space-y-2">
                        <span className="text-base font-medium text-gray-700">Loại BĐS:</span>
                        <div className="w-full flex items-center gap-1 flex-wrap">
                            {
                                listTypeAsset.map((item, index) => {
                                    return (
                                        <div key={index} className={classNames("px-3 py-2  flex items-center justify-center space-x-2 rounded-full  cursor-pointer hover:bg-blue-100 text-blue-800",
                                            { 'bg-gray-200 text-gray-700': !filter.type_asset.some((x) => x === item.key) },
                                            { 'bg-blue-100 text-blue-800': filter.type_asset.some((x) => x === item.key) },
                                        )}
                                            onClick={() => {
                                                console.log(filter.type_asset)
                                                if (filter.type_asset.some((x) => x === item.key)) {
                                                    filter.type_asset = filter.type_asset.filter((x) => x !== item.key)
                                                    return
                                                }
                                                filter.type_asset.push(item.key)
                                            }}
                                        >
                                            <span className="text-base font-medium ">{item.label}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="w-full flex flex-col space-y-2">
                        <span className="text-base font-medium text-gray-700">Khoảng giá:</span>
                        <div className="w-full flex flex-col space-x-1">
                            <InputUnit
                                label="Từ"
                                unit="VNĐ"
                                value={filter.price_start || ''}
                                onChange={(e) => { filter.price_start = e }}
                            />
                            <InputUnit
                                label="Đến"
                                unit="VNĐ"
                                value={filter.price_end || ''}
                                onChange={(e) => { filter.price_end = e }}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col space-y-2">
                        <span className="text-base font-medium text-gray-700">Diện tích:</span>
                        <div className="w-full flex flex-col space-x-1">
                            <InputUnit
                                label="Từ"
                                unit="m2"
                                value={filter.area_start || ''}
                                onChange={(e) => { filter.area_start = e }}
                            />
                            <InputUnit
                                label="Đến"
                                unit="m2"
                                value={filter.area_end || ''}
                                onChange={(e) => { filter.area_end = e }}
                            />
                        </div>
                    </div>

                </div>
                <div className="border-t border-gray-200 w-full px-3 py-2 flex flex-col space-y-1">
                    <ButtonLoading label="Áp dụng" template="ActionBlue" className="h-10 w-full flex items-center justify-center text-xl font-medium" onClick={() => {
                        onRefresh()
                        setShow(false)
                    }} />
                    <ButtonLoading label="Huỷ bỏ" template="ActionBase" className="h-10 w-full flex items-center justify-center text-xl font-medium" onClick={() => {
                        setShow(false)
                    }} />
                </div>
            </div>
        </div>
    )
})