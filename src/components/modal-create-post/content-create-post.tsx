import { observer } from "mobx-react";
import { useCreatePostContext } from "src/core/modules";
import { RadioGroup } from "../radio-group";
import { Purpose_Post, Type_Asset_Enum } from "src/core/models";
import { Colors } from "src/assets";
import { IconBase } from "../icon-base";
import { Dropdown, MenuProps } from "antd";
import { AreaAndPriceAsset } from "./area-and-price-asset";
import { AddNewMedia } from "./add-new-media";
import { InfoOwner } from "./info-owner";
import { InfoAsset } from "./info-asset";
import { SettingAuction } from "./setting-auction";
import { TitleDescription } from "./title-description";

export const ContentCreatePost = observer(() => {
    const { data } = useCreatePostContext()

    const items: MenuProps['items'] = [
        {
            key: Type_Asset_Enum.Home,
            label: 'Nhà riêng',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Home
            }
        },

        {
            key: Type_Asset_Enum.Land,
            label: 'Đất',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Land
            }
        },

        {
            key: Type_Asset_Enum.Apartment,
            label: 'Căn hộ chung cư',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Apartment
            }
        },

        {
            key: Type_Asset_Enum.Warehouse,
            label: 'Kho',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Warehouse
            }
        },

        {
            key: Type_Asset_Enum.Office,
            label: 'Văn phòng',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Office
            }
        },

        {
            key: Type_Asset_Enum.Motel,
            label: 'Nhà trọ',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Motel
            }
        },

        {
            key: Type_Asset_Enum.Hotel,
            label: 'Khách sạn',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Hotel
            }
        },

        {
            key: Type_Asset_Enum.Other,
            label: 'Khác',
            onClick: () => {
                data.type_asset = Type_Asset_Enum.Other
            }
        },

    ]

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

    const itemsAlley: MenuProps['items'] = [
        {
            key: 1,
            label: 'Trong hẻm',
            onClick: () => {
                data.in_alley = 1
            }
        },

        {
            key: 2,
            label: 'Mặt đường',
            onClick: () => {
                data.in_alley = 2
            }
        },
    ]

    const typeAlley = {
        1: { label: 'Trong hẻm', icon: 'user-outline' },
        2: { label: 'Mặt đường', icon: 'user-outline' },
    }

    return (
        <div className="w-full flex flex-col space-y-3 py-3">
            <div className="w-full flex flex-col space-y-1">
                <div className="w-full flex items-center space-x-2 px-3">
                    <span className="text-base font-medium text-gray-700">Mục đích đăng bài:</span>
                    <RadioGroup
                        value={data.purpose}
                        primary
                        data={[
                            { label: 'Cần bán', value: Purpose_Post.For_Sell },
                            { label: 'Cho thuê', value: Purpose_Post.For_Rent },
                            { label: 'Đấu giá', value: Purpose_Post.For_Auction },
                        ]}
                        onChange={(value) => {
                            data.purpose = value
                        }}
                    />
                </div>
                <div className="w-full flex items-center space-x-2 px-3">
                    <span className="text-base font-medium text-gray-700">Loại bất động sản:</span>
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <div className="flex items-center border-b border-gray-200 cursor-pointer space-x-1"
                        >
                            <span>{typeAssetPost[data.type_asset].label}</span>
                            <IconBase icon='arrowdown' size={16} color={Colors.gray[700]} />
                        </div>
                    </Dropdown>
                </div>
                <div className="w-full flex items-center space-x-2 px-3">
                    <span className="text-base font-medium text-gray-700">Vị trí:</span>
                    <Dropdown trigger={["click"]} menu={{ items: itemsAlley }}>
                        <div className="flex items-center border-b border-gray-200 cursor-pointer space-x-1"
                        >
                            <span>{typeAlley[data.in_alley].label}</span>
                            <IconBase icon='arrowdown' size={16} color={Colors.gray[700]} />
                        </div>
                    </Dropdown>
                </div>
            </div>
            <TitleDescription />
            <AddNewMedia label="Thêm hình ảnh" type='image'
                data={data.image_links}
                onChange={(newData) => {
                    data.image_links = newData
                }}
                err={data.err_image}
            />
            <AddNewMedia label="Thêm video" type='video'
                data={data.video_links}
                onChange={(newData) => {
                    data.video_links = newData
                }}
            />
            <AreaAndPriceAsset />
            <InfoAsset />
            {data.purpose === Purpose_Post.For_Auction && <SettingAuction />}
            <InfoOwner />
        </div>
    )
})