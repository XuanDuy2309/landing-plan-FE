import { observer } from 'mobx-react'
import React, { useRef } from 'react'
import { ButtonLoading, ModalBase, ModalCreatePost } from 'src/components'
import { ButtonIcon } from 'src/components/button-icon'
import { useManagementLandingPlan } from 'src/core/modules'
import { useCoreStores } from 'src/core/stores'

export const PopupDetailCoordinatesLocationContainer = observer(() => {
    const { coordinates, placementInfo, setPlacementInfo, pointsArea, selectedLocation, landingType } = useManagementLandingPlan()
    const [_, forceUpdate] = React.useReducer(x => x + 1, 0)
    const modalRef = useRef<any>(null)
    const { sessionStore } = useCoreStores()

    if (!placementInfo) return <>
        <ModalBase
            ref={modalRef}
        >
            <ModalCreatePost onClose={() => { modalRef.current.close() }} onSave={(item) => { modalRef.current.close() }} />
        </ModalBase>
    </>

    // const renderAddres = () => {
    //   if(coordinates.address) {
    //     return coordinates.address.
    //   }
    // }
    const handleClear = () => {
        pointsArea.isRouting = false
        pointsArea.routeTo = undefined
        setPlacementInfo(undefined)
    }

    const handleSubmit = () => {
        pointsArea.isRouting = true
        pointsArea.routeTo = [Number(selectedLocation.lat), Number(selectedLocation.lng)]
        selectedLocation.lat = undefined
        selectedLocation.lng = undefined
    }

    return (
        <>
            <div className="w-[480px] space-y-3 px-3 pt-3 absolute bottom-6 left-1/2 -translate-x-1/2 bg-white z-[99999] shadow-lg rounded-[4px] text-gray-900 text-[14px] leading-[20px]">
                <div className="flex items-start justify-between">
                    <div className='flex flex-col'>
                        <span className='font-medium text-[15px] line-clamp-2'>{placementInfo.display_name}</span>
                        <span className='text-[12px] text-blue-600'>{selectedLocation.lat}, {selectedLocation.lng}</span>
                    </div>
                    <div className="flex flex-none">
                        <ButtonIcon
                            icon='close-outline'
                            onClick={() => {
                                handleClear()
                            }}
                            size='xxs'
                        />
                    </div>
                </div>

                <div className="w-full flex items-center justify-end space-x-2 px-1 flex-none h-14 border-t border-gray-200">
                    <ButtonLoading label="Huỷ bỏ" template="ActionBase" size="xs" onClick={() => {
                        handleClear()
                    }} />
                    {sessionStore.profile && <ButtonLoading iconLeft='location-outline' label="Đăng bài" template="ActionBlueOutline" size="xs" onClick={() => {
                        modalRef.current.open();
                    }} />}
                    <ButtonLoading iconLeft='share-outline' label="Chỉ đường" template="ActionBlue" size="xs" onClick={() => {
                        handleSubmit()
                    }} />
                </div>

            </div>

            <ModalBase
                ref={modalRef}
            >
                <ModalCreatePost
                    onClose={() => { modalRef.current.close() }}
                    onSave={(item) => { modalRef.current.close() }}
                    lat={selectedLocation.lat} lng={selectedLocation.lng} landingType={landingType} />
            </ModalBase>

        </>
    )
}
)
