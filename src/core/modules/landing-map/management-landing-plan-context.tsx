import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LandingPlanApi, SearchLandingPlanReverseApi } from 'src/core/api'
import { CoordinateSearchLocationModel, NominatimResult, PointsMapModel, SelectedLocationModel } from 'src/core/models'

export class ManagementLandingPlanContextType {
  setPlacement = (placement: NominatimResult) => { }
  placement = new NominatimResult()
  selectedLocation = new SelectedLocationModel()
  setSelectedLocation = (selectedLocation: SelectedLocationModel) => { }
  polygon = null
  setPolygon = (polygon: any) => { }
  isDraw = false
  setIsDraw = (isDraw: boolean) => { }
  searchCoordinatesLocation = async (lat: number, lon: number) => { }
  coordinates = new CoordinateSearchLocationModel()
  setCoordinates = (coordinates: CoordinateSearchLocationModel) => { }
  pointsArea = new PointsMapModel()
  setPointsArea = (pointsArea: PointsMapModel) => { }
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
  const [coordinates, setCoordinates] = useState<CoordinateSearchLocationModel>(new CoordinateSearchLocationModel());

  const [polygon, setPolygon] = useState<any>(null);
  const [placementInfo, setPlacementInfo] = useState<any>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const [pointsArea, setPointsArea] = useState<PointsMapModel>(new PointsMapModel());

  useEffect(() => {
    if (
      placement.geojson &&
      placement.geojson.coordinates &&
      placement.geojson.coordinates.length > 0 &&
      Array.isArray(placement.geojson.coordinates) &&
      Array.isArray(placement.geojson.coordinates[0])
    ) {
      const temp = placement.geojson.coordinates[0].map((coord) => [coord[1], coord[0]]);
      setPolygon(temp);
    } else {
      setPolygon(null);
    }
  }, [placement]);

  const drawCoordinates = (coordinates: any) => {
    if (coordinates && coordinates.length > 0) {
      const temp = coordinates.map((coord: any) => [coord[0], coord[1]])
      return temp
    }
    return []
  }

  const searchCoordinatesLocation = async (lat: number, lon: number) => {
    const params = {
      lat: lat,
      lon: lon
    }
    const res = await LandingPlanApi.searchCoordinatesLocation(params)
    const res2 = await SearchLandingPlanReverseApi.searchInterval(params)
    if (res.Status) {
      const temp = drawCoordinates(res.Data.data.points)
      setCoordinates({
        ...res.Data.data,
        points: temp,
        address: res2.data.address,
        display_name: res2.data.display_name,
        name: res2.data.name
      })
      return
    }
    setCoordinates(new CoordinateSearchLocationModel())
  }

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
        setIsDraw,
        searchCoordinatesLocation,
        coordinates,
        setCoordinates,
        pointsArea,
        setPointsArea,
      }}
    >
      {children}
    </ManagementLandingPlanContext.Provider>
  )
})

export const useManagementLandingPlan = () => {
  return useContext(ManagementLandingPlanContext)
}
