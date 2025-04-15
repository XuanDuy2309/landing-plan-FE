import { Dropdown, Tabs } from "antd"
import { makeAutoObservable, set } from "mobx"
import { observer } from "mobx-react"
import { use, useEffect, useMemo, useState } from "react"
import { ListProvince } from "./list-province"
import { ListDistrict } from "./list-district"
import { ListWard } from "./list-ward"

interface IProps {
    value: string
    onChange: (value: Location) => void
}

class Location {
    id_province?: number
    province_name?: string
    id_district?: number
    district_name?: string
    id_ward?: number
    ward_name?: string
    constructor() {
        makeAutoObservable(this)
    }
}

export const DropdownSelectAddress = observer(({ value, onChange }: IProps) => {
    const [data, setData] = useState<Location>(new Location())
    const [open, setOpen] = useState<boolean>(false)

    const strLocation = useMemo(() => {
        if (data.district_name && data.province_name && data.ward_name) {
            setOpen(false)
            return data.ward_name + ', ' + data.district_name + ', ' + data.province_name
        }
        return undefined
    }, [data.district_name, data.province_name, data.ward_name])
    return <Dropdown trigger={["click"]}
        dropdownRender={() => <DropdownRender data={data}
            onChangeProvince={(value) => {
                data.id_province = value.id
                data.province_name = value.name
                onChange(data)
            }}
            onChangeDistrict={(value) => {
                data.district_name = value.name
                data.id_district = value.id
                onChange(data)
            }}
            onChangeWard={(value) => {
                data.ward_name = value.name
                data.id_ward = value.id
                onChange(data)
            }} />}
        open={open}
        onOpenChange={(value) => {
            setOpen(value)
        }}
    >
        <div className="w-full border-b border-gray-200" onClick={() => {
            setData(new Location())
            setOpen(true)
        }}>
            <span>{value || strLocation || 'Chọn Tỉnh, Huyện, Xã'}</span>
        </div>
    </Dropdown>
})

interface IProps2 {
    data: Location
    onChangeProvince?: (value) => void
    onChangeDistrict?: (value) => void
    onChangeWard?: (value) => void
}

const DropdownRender = observer(({ data, onChangeProvince, onChangeDistrict, onChangeWard }: IProps2) => {
    const [activeTab, setActiveTab] = useState(0)
    const dataTabs = [
        {
            label: "Thành phố/Tỉnh",
            component: <ListProvince onChange={(value) => {
                onChangeProvince && onChangeProvince(value)
                setActiveTab(1)
            }} />,
            onclick: () => {
                data.id_province = undefined
                data.id_district = undefined
                data.id_ward = undefined
                data.district_name = undefined
                data.ward_name = undefined
            }
        },
        {
            label: "Quận/Huyện",
            component: <ListDistrict id={data.id_province || 0} onChange={(value) => {
                onChangeDistrict && onChangeDistrict(value)
                setActiveTab(2)
            }} />,
            disabled: !data.id_province,
            onclick: () => {
                data.id_ward = undefined
                data.ward_name = undefined
            }
        },
        {
            label: "Phường/Xã",
            component: <ListWard id={data.id_district || 0} onChange={(value) => {
                onChangeWard && onChangeWard(value)
            }} />,
            disabled: !data.id_district,
            onclick: () => { }
        }
    ]

    useEffect(() => {
        if (!data.id_province && !data.id_district) {
            setActiveTab(0)
            return
        }
        if (!data.id_district && !data.id_ward) {
            setActiveTab(1)
            return
        }
    }, [data.id_province, data.id_district, data.id_ward])
    return (
        <div className="w-full flex flex-col bg-white border border-gray-200 shadow-md">
            <Tabs
                activeKey={activeTab.toString()}
                onChange={(e) => {
                    setActiveTab(Number(e))
                }}
            >
                {
                    dataTabs.map((item, index) => {
                        return <Tabs.TabPane
                            destroyInactiveTabPane={true}
                            tab={
                                <div className="h-full flex items-center justify-center px-3 py-1"
                                    onClick={item.onclick}
                                >
                                    <span>{item.label}</span>
                                </div>}
                            key={index}
                            disabled={item.disabled}
                        >
                            {item.component}
                        </Tabs.TabPane>
                    })
                }
            </Tabs>
        </div>
    )
})