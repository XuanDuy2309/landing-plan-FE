import debounce from "debounce";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { LayersControl, MapContainer, Marker, Pane, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { Colors } from 'src/assets';
import { isValidPolygon } from 'src/core/base';
import { NominatimResult, SelectedLocationModel } from 'src/core/models';
import { FilterPostContextType, useManagementLandingPlan, usePostContext } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import './leaflet-map-container.css';
import { ListPostMarkerLeafletMap } from "./list-post-marker-leaflet-map";
import { RoutingMachineLeafletMap } from "./routing-machine-leaflet-map";

export const LeafletMapContainer = observer(() => {
    const { location } = useCoreStores().sessionStore
    const { placement, polygon, selectedLocation, setSelectedLocation, coordinates, pointsArea, landingPlanMap, opacity } = useManagementLandingPlan()
    const { data, filter, onRefresh } = usePostContext()

    const calculateDistance = useMemo(() => {
        return pointsArea.calculateDistance() || 0
    }, [pointsArea.currentMousePos, pointsArea.points]);

    const { sessionStore } = useCoreStores();

    useEffect(() => {
        sessionStore.requestLocation();
    }, [])

    return (
        <MapContainer
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            center={[location.lat, location.lng]}
            zoom={14}
            maxZoom={22}
            minZoom={8}
            attributionControl={true}
        >
            <MapEvents setSelectedLocation={setSelectedLocation} filter={filter} onRefresh={onRefresh} />
            <MapViewUpdater placement={placement} setSelectedLocation={setSelectedLocation} />
            {pointsArea.routeTo && <RoutingMachineLeafletMap
                from={[location.lat, location.lng]}
                to={[pointsArea.routeTo[0], pointsArea.routeTo[1]]}
                isRouting={pointsArea.isRouting}
                onChangeLocation={(lat, lng) => { setSelectedLocation({ lat, lng }) }}
            />}
            <LayersControl>
                <LayersControl.BaseLayer checked name="Map mặc định">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        minZoom={0}
                        maxNativeZoom={21}    // Nhưng chỉ tải tile tới mức 18
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map vệ tinh">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        minZoom={0}
                        maxNativeZoom={21}    // Nhưng chỉ tải tile tới mức 18
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map địa hình">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=m,t&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        minZoom={0}
                        maxNativeZoom={21}    // Nhưng chỉ tải tile tới mức 18
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <Pane name="customOverlayPane" style={{ zIndex: 400 }}>
                {landingPlanMap && landingPlanMap.folder_path && (
                    <TileLayer
                        url={`${landingPlanMap.folder_path}/{z}/{x}/{y}.png`}
                        pane="customOverlayPane"
                        minZoom={0}
                        maxZoom={30}
                        maxNativeZoom={18}
                        opacity={opacity}
                    />
                )}
            </Pane>
            {/* <TileLayer
                url={`https://cdn.dandautu.vn/quy-hoach/ha_noi/hoang_mai__ha_noi/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={0.8}
                zIndex={999}
                tms={true}
            // opacity={opacit}
            /> */}

            {selectedLocation.lat && selectedLocation.lng && !pointsArea.isRouting && (
                <Marker position={[Number(selectedLocation.lat), Number(selectedLocation.lng)]}>
                    <Popup

                    >
                        <div className="p-3">
                            <span>Vị trí hiện tại</span>
                        </div>
                    </Popup>
                </Marker>
            )}
            {isValidPolygon(polygon) && <Polygon pathOptions={{ fillColor: 'transparent', weight: 5 }} positions={polygon as any} />}
            {isValidPolygon(coordinates.points) && <Polygon pathOptions={{ fillColor: Colors.red[200], weight: 5, color: Colors.red[300] }} positions={coordinates.points} />}
            {pointsArea.points.length >= 2 &&
                pointsArea.points.slice(0, -1).map((pt, i) => {
                    const next = pointsArea.points[i + 1];
                    return (
                        <Polyline key={i} positions={[[pt[1], pt[0]], [next[1], next[0]]]} color="red">
                            <Tooltip permanent direction="center">
                                {(pointsArea.segmentLengths[i] * 1000).toFixed(0)} m
                            </Tooltip>
                        </Polyline>
                    );
                })}

            {/* Polygon và diện tích */}
            {pointsArea.points.length >= 3 && !pointsArea.isDraw && (
                <>
                    <Polygon positions={pointsArea.points.map(([lng, lat]) => [lat, lng])} color="red" weight={2} >
                        {/* Label diện tích ở giữa polygon */}
                        {pointsArea.areaLabelPosition && (
                            <Tooltip
                                direction="center"
                                permanent
                                // position={[pointsArea.areaLabelPosition[0], pointsArea.areaLabelPosition[1]]}
                                offset={[0, 0]}
                                className="area-tooltip"
                            >
                                {(pointsArea.area).toFixed(0)} m²
                            </Tooltip>
                        )}
                    </Polygon>
                </>
            )}

            {/* Marker hình tròn tại điểm được vẽ */}
            {pointsArea.points.length > 0 &&
                pointsArea.points.map(([lng, lat], index) => (
                    <Marker
                        key={index}
                        position={[lat, lng]}
                        icon={L.divIcon({
                            className: "custom-marker",
                            html: `<div style="width: 16px; height: 16px; background: red; border-radius: 50%; border: 2px solid white;"></div>`,
                        })}
                        eventHandlers={{
                            click: () => {
                                pointsArea.addPoint([lng, lat], true);
                            }
                        }}
                    />
                ))}

            {pointsArea.points.length > 0 && pointsArea.currentMousePos && pointsArea.isDraw && (
                <Polyline
                    positions={[
                        [pointsArea.points[pointsArea.points.length - 1][1], pointsArea.points[pointsArea.points.length - 1][0]],
                        [pointsArea.currentMousePos.lat, pointsArea.currentMousePos.lng]
                    ]}
                    color={"red"}
                    weight={2}
                    dashArray={"5, 10"}
                >
                    {/* Tooltip sẽ di chuyển theo con trỏ chuột */}
                    <Tooltip position={[pointsArea.currentMousePos.lat, pointsArea.currentMousePos.lng]} direction="center" permanent>
                        {calculateDistance.toFixed(0)} m
                    </Tooltip>
                </Polyline>
            )}

            <ListPostMarkerLeafletMap />

            <Marker
                position={[location.lat, location.lng]}
                icon={L.divIcon({
                    className: "custom-marker",
                    html: `<div style="width: 16px; height: 16px; background: blue; border-radius: 50%; border: 2px solid white;"></div>`,
                })}
            >
                <Popup>
                    <div>
                        <span>Vị trí của bạn</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>

    )
}
)

interface IProps2 {
    placement: NominatimResult
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
}

const MapViewUpdater = observer(({ placement, setSelectedLocation }: IProps2) => {
    const map = useMap();
    const { location } = useCoreStores().sessionStore;

    useEffect(() => {
        if (placement?.lat && placement?.lon) {
            map.flyTo([Number(placement.lat), Number(placement.lon)], map.getZoom(), {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            setSelectedLocation({ lat: Number(placement.lat), lng: Number(placement.lon) })
        }
    }, [placement.lat, placement.lon, map]);

    useEffect(() => {
        const handleGoToLocation = () => {
            if (location?.lat && location?.lng) {
                map.flyTo([location.lat, location.lng], 18, {
                    animate: true,
                    duration: 1,
                });
            }
        };

        window.addEventListener('go-to-current-location', handleGoToLocation);
        map.invalidateSize();
        if (location?.lat !== 0 && location?.lng !== 0) {
            map.flyTo([location.lat, location.lng], 18, {
                animate: true,
                duration: 1,
            });
        }
        return () => {
            window.removeEventListener('go-to-current-location', handleGoToLocation);
        };
    }, [map, location.lat, location.lng]);

    return null;
});

interface IProps3 {
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
    filter?: FilterPostContextType
    onRefresh?: () => void
}
const MapEvents = observer(({ setSelectedLocation, filter, onRefresh }: IProps3) => {
    // const { getInfoPlacement } = useManagementLandingPlan()
    const map = useMap();
    const { searchCoordinatesLocation, pointsArea } = useManagementLandingPlan()

    useMapEvents({

        moveend: async (e) => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            const zoom = map.getZoom();
            const { lat, lng } = center;
            const radius = center.distanceTo(bounds.getNorthEast()); // bán kính tính bằng mét
            debounce(() => {
                if (filter) {
                    filter.lat = lat;
                    filter.lng = lng;
                    filter.range = radius; // truyền bán kính đúng đơn vị
                    onRefresh && onRefresh();
                }
            }, 300)();
        },

        click: async (e) => {
            const { lat, lng } = e.latlng;
            if (!pointsArea.isDraw && !pointsArea.isRouting) {
                map.setView([lat, lng], map.getZoom());
                setSelectedLocation({ lat, lng })
                searchCoordinatesLocation(lat, lng)
                return
            }
            if (pointsArea.isRouting) {
                pointsArea.routeTo = [lat, lng]
                setSelectedLocation({ lat, lng })
                // setSelectedLocation({lat: undefined, lng: undefined})
                return
            }
            pointsArea.addPoint([lng, lat])
        },

        mousemove: (e) => {
            if (!pointsArea.isDraw) return
            pointsArea.currentMousePos = e.latlng;
        }
    });

    return null;
});

