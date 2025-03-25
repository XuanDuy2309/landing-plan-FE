import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { NominatimResult, SelectedLocationModel } from 'src/core/models'

export class ManagementLandingPlanContextType {
  setPlacement = (placement: NominatimResult) => { }
  placement = new NominatimResult()
  selectedLocation = new SelectedLocationModel()
  setSelectedLocation = (selectedLocation: SelectedLocationModel) => { }
  polygon = null
  setPolygon = (polygon: any) => { }
  isDraw = false
  setIsDraw = (isDraw: boolean) => { }
}

export const ManagementLandingPlanContext = createContext<ManagementLandingPlanContextType>(
  new ManagementLandingPlanContextType()
)

interface IProps {
  children: React.ReactNode
}

export const ManagementLandingPlanProvider = observer(({ children }: IProps) => {
  const [placement, setPlacement] = useState<NominatimResult>(new NominatimResult())
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocationModel>(new SelectedLocationModel())
  const [polygon, setPolygon] = useState<any>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  useEffect(() => {
    if (placement.geojson && placement.geojson.coordinates && Array.isArray(placement.geojson?.coordinates[0])) {
      const temp = placement.geojson?.coordinates[0].map((coord) => [coord[1], coord[0]])
      setPolygon(temp);
    }
  }, [placement]);



  return (
    <ManagementLandingPlanContext.Provider
      value={{
        setPlacement,
        placement,
        selectedLocation,
        setSelectedLocation,
        polygon,
        setPolygon,
        isDraw,
        setIsDraw
      }}
    >
      {children}
    </ManagementLandingPlanContext.Provider>
  )
})

export const useManagementLandingPlan = () => {
  return useContext(ManagementLandingPlanContext)
}
