import { observer } from "mobx-react"
import { useCreatePostContext } from "src/core/modules"
import { InputLabel } from "../input-label"
import { Dropdown, Input, MenuProps } from "antd"
import { IconBase } from "../icon-base"
import { Colors } from "src/assets"
import { Direction_Land_Enum, Type_Asset_Enum } from "src/core/models"

export const InfoAsset = observer(() => {
    const { data } = useCreatePostContext()

    const items: MenuProps['items'] = [
        {
            key: Direction_Land_Enum.North,
            label: 'Bắc',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.North
            }
        },

        {
            key: Direction_Land_Enum.South,
            label: 'Nam',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.South
            }
        },

        {
            key: Direction_Land_Enum.East,
            label: 'Đông',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.East
            }
        },

        {
            key: Direction_Land_Enum.West,
            label: 'Tây',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.West
            }
        },

        {
            key: Direction_Land_Enum.North_West,
            label: 'Tây Bắc',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.North_West
            }
        },

        {
            key: Direction_Land_Enum.North_East,
            label: 'Đông Bắc',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.North_East
            }
        },

        {
            key: Direction_Land_Enum.South_West,
            label: 'Tây Nam',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.South_West
            }
        },

        {
            key: Direction_Land_Enum.South_East,
            label: 'Đông Nam',
            onClick: () => {
                data.direction_land = Direction_Land_Enum.South_East
            }
        },

    ]

    const typeAssetPost = {
        1: { label: 'Bắc', icon: 'user-outline' },
        2: { label: 'Nam', icon: 'user-outline' },
        3: { label: 'Đông', icon: 'user-outline' },
        4: { label: 'Tây', icon: 'user-outline' },
        5: { label: 'Tây Bắc', icon: 'user-outline' },
        6: { label: 'Đông Bắc', icon: 'user-outline' },
        7: { label: 'Tây Nam', icon: 'user-outline' },
        8: { label: 'Tây Bắc', icon: 'user-outline' },
    }

    const conditions = () => {
        if (data.type_asset === Type_Asset_Enum.Home
            || data.type_asset === Type_Asset_Enum.Apartment
            || data.type_asset === Type_Asset_Enum.Office
            || data.type_asset === Type_Asset_Enum.Other
            || data.type_asset === Type_Asset_Enum.Motel
            || data.type_asset === Type_Asset_Enum.Hotel
        ) {
            return true
        }
        return false
    }

    return <div className="w-full flex flex-col space-y-2 px-3">
        <span className="text-xl font-medium text-gray-900">Thông tin bất động sản:</span>
        <div className="flex flex-col space-y-1">
            <div className="w-full flex items-center space-x-2">
                <span className="w-[130px] flex-none text-end text-gray-700">Hướng đất:</span>
                <Dropdown trigger={["click"]} menu={{ items }}>
                    <div className="flex items-center border-b border-gray-200 cursor-pointer space-x-1"
                    >
                        <span>{typeAssetPost[data.direction_land].label}</span>
                        <IconBase icon='arrowdown' size={16} color={Colors.gray[700]} />
                    </div>
                </Dropdown>
            </div>
            {conditions() &&
                <>
                    <InputLabel label='Số tầng'
                        value={data.number_floors ? data.number_floors.toString() : ''}
                        onChange={(value) => {
                            data.number_floors = Number(value)
                        }}
                        placeholder="0"
                        classNamesInput="!w-[50px] text-center"
                        error={data.err_number_floors}
                    />
                    <InputLabel label='Số phòng ngủ'
                        value={data.number_bedrooms ? data.number_bedrooms.toString() : ''}
                        onChange={(value) => {
                            data.number_bedrooms = Number(value)
                        }}
                        placeholder="0"
                        classNamesInput="!w-[50px] text-center"
                        error={data.err_number_bedrooms}
                    />
                    <InputLabel label='Số phòng tắm'
                        value={data.number_bathrooms ? data.number_bathrooms.toString() : ''}
                        onChange={(value) => {
                            data.number_bathrooms = Number(value)
                        }}
                        placeholder="0"
                        classNamesInput="!w-[50px] text-center"
                        error={data.err_number_bathrooms}
                    />
                </>}
        </div>
    </div>
})  