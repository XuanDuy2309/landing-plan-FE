import { observer } from 'mobx-react'
import React from 'react'
import { IconBase } from 'src/components'
import { ButtonIcon } from 'src/components/button-icon'
import { useManagementLandingPlan } from 'src/core/modules'

export const PopupDetailCoordinatesLocationContainer = observer(() => {
  const { coordinates } = useManagementLandingPlan()
  const [_, forceUpdate] = React.useReducer(x => x + 1, 0)

  if (!coordinates.id) return null

  // const renderAddres = () => {
  //   if(coordinates.address) {
  //     return coordinates.address.
  //   }
  // }

  return (
    <div className="w-[480px] p-3 absolute bottom-6 left-1/2 -translate-x-1/2 bg-white z-[99999] shadow-lg rounded-[4px] text-gray-900 text-[14px] leading-[20px]">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <span className='font-medium text-[15px] truncate'>{coordinates.name}</span>
        </div>
        <div className="flex flex-none">
          <ButtonIcon
            icon='close-outline'
            onClick={() => {coordinates.id = undefined; forceUpdate()}}
            size='xxs'
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-2  text-[12px]">
        <span>Diện tích: <span className='font-medium'>{coordinates.area}m²</span></span>
        <div className='flex items-center gap-2'>
          <IconBase icon='location-outline' size={16} color='currentColor' />
          <div className='flex gap-0.5 items-center'>
            <span className='text-blue-700 underline font-medium'>{coordinates.address?.road}</span>,
            <span className='text-blue-700 underline font-medium'>{coordinates.address?.quarter}</span>,
            <span className='text-blue-700 underline font-medium'>{coordinates.address?.suburb}</span>,
            <span className='text-blue-700 underline font-medium'>{coordinates.address?.city}</span>
          </div>
        </div>
        <span>Chủ đầu tư: {coordinates.owner_name || "Duydx"}</span>
      </div>
    </div>
  )
}
)