
import { observer } from 'mobx-react'
import { ButtonLoading } from 'src/components'
import { ButtonIcon } from 'src/components/button-icon'
import { ActionMap, useCreatePostContext, useManagementLandingPlan } from 'src/core/modules'

export const PopupDetailLocationContainer = observer(() => {
    const { placementInfo, setPlacementInfo, selectedLocation, landingType, pointsArea, opacity, setOpacity, selectedLandTypeChange } = useManagementLandingPlan()
    const { data, setOpenMap, action, setAction, setMessage } = useCreatePostContext()

    if (!placementInfo) return null

    // const renderAddres = () => {
    //   if(coordinates.address) {
    //     return coordinates.address.
    //   }
    // }

    const handleClear = () => {
        setPlacementInfo(undefined)
        setOpenMap(false)
        setAction(undefined)
        setMessage('')
    }

    const handleSubmit = () => {
        if (action === ActionMap.Select_location) {
            data.address = placementInfo.display_name
            data.lat = Number(selectedLocation.lat)
            data.lng = Number(selectedLocation.lng)
            data.type_landing = landingType
            data.type_landing_id = landingType?.id
            setAction(ActionMap.Select_coordinate)
            pointsArea.isDraw = true;
            if (pointsArea.isDraw) {
                setMessage("Xác định đường ranh BĐS của bạn bằng chọn trên bản đồ")
                pointsArea.points = [];
                pointsArea.area = 0;
            }
            return
        }
        if (action === ActionMap.Select_coordinate) {
            const coordinate = pointsArea.points.map((item) => {
                return item.join(' ')
            }).join(', ')
            data.coordinates = 'POLYGON((' + coordinate + '))'
            data.area = pointsArea.area
            setAction(undefined)
            setOpenMap(false)
            setMessage('')
        }
    }

    return (
        <div className="w-[480px] space-y-3 px-3 pt-3 absolute bottom-6 left-1/2 -translate-x-1/2 bg-white z-[99999] shadow-lg rounded-[4px] text-gray-900 text-[14px] leading-[20px]">
            <div className="flex items-start justify-between">
                <div className='flex flex-col'>
                    <span className='font-medium text-[15px] line-clamp-2'>{placementInfo.display_name}</span>
                    {landingType?.code && <span className='font-medium text-[12px]'>Loại đất {selectedLandTypeChange?.land_type_code || landingType?.code} - {selectedLandTypeChange?.land_type_name || landingType?.name}</span>}
                </div>

                <div className="flex flex-none">
                    <ButtonIcon
                        icon='close-outline'
                        onClick={() => {
                            setPlacementInfo(undefined)
                        }}
                        size='xxs'
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-end space-x-2 px-1 flex-none h-14 border-t border-gray-200">
                <ButtonLoading label="Huỷ bỏ" template="ActionBase" size="xs" onClick={() => {
                    handleClear()
                }} />
                {
                    pointsArea.points.length > 0 && (
                        <ButtonLoading label="Chọn lại đường ranh" template="ActionOrange" size="xs" onClick={() => {
                            pointsArea.reset()
                            pointsArea.isDraw = true
                        }} />
                    )
                }
                <ButtonLoading label="Xác nhận" template="ActionBlue" size="xs" onClick={() => {
                    handleSubmit()
                }} />
            </div>

        </div>
    )
}
)
