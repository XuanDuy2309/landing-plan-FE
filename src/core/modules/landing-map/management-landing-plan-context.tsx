import { observer } from 'mobx-react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { LandingMapApi, LandingPlanApi, SearchLandingPlanReverseApi } from 'src/core/api'
import { CoordinateSearchLocationModel, LandingPlanModel, LandingTypeModel, NominatimResult, PointsMapModel, SelectedLocationModel } from 'src/core/models'

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
    landingPlanMap: LandingPlanModel[] = []
    setLandingPlanMap = (landingPlanMap: LandingPlanModel[]) => { }
    opacity = 1
    setOpacity = (opacity: number) => { }
    placementInfo: NominatimResult | undefined
    setPlacementInfo = (placementInfo: NominatimResult | undefined) => { }
    onSearchByLatLon = async (lat: number, lon: number) => { }
    openSidebar = false
    setOpenSidebar = (openSidebar: boolean) => { }
    hoveredPostId: number | null = null;
    setHoveredPostId = (id: number | null) => { };
    selectedLandingPlan: LandingPlanModel | undefined
    setSelectedLandingPlan = (selectedLandingPlan: LandingPlanModel | undefined) => { }
    shouldFlyToLandingPlan = false
    setShouldFlyToLandingPlan = (val: boolean) => { }
    listCoordinates: string[] = []
    setListCoordinates!: (lisCoordinates: string[]) => void
    detectLandType: (lat: number, lon: number, zoom?: number) => void = async () => { }
    landingType: LandingTypeModel | undefined
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
    const [listCoordinates, setListCoordinates] = useState<string[]>([]);

    const [polygon, setPolygon] = useState<any>(null);
    const [placementInfo, setPlacementInfo] = useState<NominatimResult>();
    const [isDraw, setIsDraw] = useState<boolean>(false);

    const [pointsArea, setPointsArea] = useState<PointsMapModel>(new PointsMapModel());
    const [landingPlanMap, setLandingPlanMap] = useState<LandingPlanModel[]>([])
    const [selectedLandingPlan, setSelectedLandingPlan] = useState<LandingPlanModel | undefined>()
    const [shouldFlyToLandingPlan, setShouldFlyToLandingPlan] = useState(false);

    const [opacity, setOpacity] = useState<number>(1);
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);

    const [landingType, setLandingType] = useState<LandingTypeModel>();

    const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);

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

    const onSearchByLatLon = async (lat: number, lon: number) => {
        const params = {
            lat: lat,
            lon: lon
        }
        await SearchLandingPlanReverseApi.searchInterval(params)
            .then((res) => {
                setPlacementInfo(res.data)
            }).catch((error) => {
                console.log(error)
            })
    }

    const searchLandingPlan = async (lat: number, lon: number, radius?: number) => {
        try {
            const [res, res2] = await Promise.all([
                LandingPlanApi.searchLandingPlan({ lat, lon, radius }),
                LandingPlanApi.searchLandingPlan({ lat, lon })
            ]);

            if (res.Status && res2.Status) {
                setLandingPlanMap(res.Data.data);
                if (res2.Data.data.length > 0) {
                    setSelectedLandingPlan(res2.Data.data[0]);
                }
            } else {
                setLandingPlanMap([]);
                setSelectedLandingPlan(undefined);
            }
        } catch (error) {
            console.error("searchLandingPlan error:", error);
            setLandingPlanMap([]);
            setSelectedLandingPlan(undefined);
        } finally {
            setShouldFlyToLandingPlan(false);
        }
    }

    const detectLandType = async (lat: number, lon: number, zoom?: number) => {
        try {
            const res = await LandingMapApi.detectLandType({ lat, lon, zoom });
            if (res.Status) {
                setLandingType(res.Data.data)
            } else {
                setLandingType(undefined)
            }
        } catch (error) {
            setLandingPlanMap([]);
            setSelectedLandingPlan(undefined);
            return undefined;
        } finally {
            setShouldFlyToLandingPlan(false);
        }
    }

    useEffect(() => {
        if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
            searchLandingPlan(selectedLocation.lat, selectedLocation.lng, selectedLocation.radius)
            onSearchByLatLon(selectedLocation.lat, selectedLocation.lng)
        }
    }, [selectedLocation])

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
                landingPlanMap,
                setLandingPlanMap,
                opacity,
                setOpacity,
                placementInfo,
                setPlacementInfo,
                onSearchByLatLon,
                openSidebar,
                setOpenSidebar,
                hoveredPostId,
                setHoveredPostId,
                selectedLandingPlan,
                setSelectedLandingPlan,
                shouldFlyToLandingPlan,
                setShouldFlyToLandingPlan,
                listCoordinates,
                setListCoordinates,
                detectLandType,
                landingType
            }}
        >
            {children}
        </ManagementLandingPlanContext.Provider>
    )
})

export const useManagementLandingPlan = () => {
    return useContext(ManagementLandingPlanContext)
}
