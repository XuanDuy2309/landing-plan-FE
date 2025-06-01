import debounce from "debounce";
import L from "leaflet";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useRef } from 'react';
import { LayersControl, MapContainer, Marker, Pane, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useSearchParams } from "react-router-dom";
import { Colors } from 'src/assets';
import { isValidPolygon } from 'src/core/base';
import { LandingPlanModel, NominatimResult, SelectedLocationModel } from 'src/core/models';
import { FilterPostContextType, useManagementLandingPlan, usePostContext } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import './leaflet-map-container.css';
import { ListPostMarkerLeafletMap } from "./list-post-marker-leaflet-map";

export const LeafletMapContainer = observer(() => {
    const [searchParams] = useSearchParams();
    const { location } = useCoreStores().sessionStore
    const {
        placement,
        polygon,
        selectedLocation,
        setSelectedLocation,
        coordinates,
        pointsArea,
        landingPlanMap,
        opacity,
        selectedLandingPlan,
        setHoveredPostId
    } = useManagementLandingPlan();
    const { data, filter, onRefresh } = usePostContext()

    const calculateDistance = useMemo(() => {
        return pointsArea.calculateDistance() || 0
    }, [pointsArea.currentMousePos, pointsArea.points]);

    const { sessionStore } = useCoreStores();

    useEffect(() => {
        sessionStore.requestLocation();
    }, [])

    const postId = useMemo(() => {
        return searchParams.get('post_id')
    }, [searchParams])

    const latParams = useMemo(() => {
        return searchParams.get('lat')
    }, [searchParams])

    const lngParams = useMemo(() => {
        return searchParams.get('lng')
    }, [searchParams])

    useEffect(() => {
        // Set post ID if present
        if (postId) {
            setHoveredPostId(Number(postId));
        }

        // Set location if both lat and lng are present
        if (latParams && lngParams && postId) {
            const numLat = Number(latParams);
            const numLng = Number(lngParams);

            // Only set if values are valid numbers
            if (!isNaN(numLat) && !isNaN(numLng)) {
                setSelectedLocation({
                    lat: numLat,
                    lng: numLng,
                    radius: 1000 // Default radius or calculate based on map bounds
                });
            }
        }
    }, [searchParams]); // Only run when URL params change


    return (
        <MapContainer
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            center={[Number(latParams) || location.lat, Number(lngParams) || location.lng]}
            zoom={14}
            maxZoom={22}
            minZoom={8}
            attributionControl={true}
        >
            <MapEvents setSelectedLocation={setSelectedLocation} filter={filter} onRefresh={onRefresh} />
            <MapViewUpdater placement={placement} setSelectedLocation={setSelectedLocation} landingPlan={selectedLandingPlan} latParams={Number(latParams)} lngParams={Number(lngParams)} />
            {pointsArea.routeTo && pointsArea.isRouting && <RoutingMachine
                from={[location.lat, location.lng]}
                to={[pointsArea.routeTo[0], pointsArea.routeTo[1]]}
            // onChangeLocation={(lat, lng) => { setSelectedLocation({ lat, lng }) }}
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
                {selectedLandingPlan && selectedLandingPlan.folder_path && (
                    <TileLayer
                        url={`${selectedLandingPlan.folder_path}/{z}/{x}/{y}.png`}
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
            <Pane name="areaPane" style={{ zIndex: 500 }}>
                {pointsArea.points.length >= 2 &&
                    pointsArea.points.slice(0, -1).map((pt, i) => {
                        const next = pointsArea.points[i + 1];
                        return (
                            <Polyline key={i} positions={[[pt[1], pt[0]], [next[1], next[0]]]} color="red" pane="areaPane">
                                <Tooltip permanent direction="center">
                                    {(pointsArea.segmentLengths[i] * 1000).toFixed(0)} m
                                </Tooltip>
                            </Polyline>
                        );
                    })}

                {/* Polygon và diện tích */}
                {pointsArea.points.length >= 3 && !pointsArea.isDraw && (
                    <>
                        <Polygon
                            pane="areaPane"
                            positions={pointsArea.points.map(([lng, lat]) => [lat, lng])} color="red" weight={2} >
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
                <ListPostMarkerLeafletMap />

            </Pane>

            {/* Marker hình tròn tại điểm được vẽ */}
            {pointsArea.points.length > 0 &&
                pointsArea.points.map(([lng, lat], index) => (
                    <Marker
                        key={index}
                        position={[lat, lng]}
                        icon={L.divIcon({
                            className: "custom-marker",
                            html: `<div style="width: 16px; height: 16px; background: red; border-radius: 50%; border: 2px solid white; cursor: crosshair"></div>`,
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
    landingPlan?: LandingPlanModel
    latParams?: number
    lngParams?: number
}

const MapViewUpdater = observer(({ placement, setSelectedLocation, landingPlan, latParams, lngParams }: IProps2) => {
    const map = useMap();
    const { location } = useCoreStores().sessionStore;
    const { shouldFlyToLandingPlan, setShouldFlyToLandingPlan } = useManagementLandingPlan();

    useEffect(() => {
        if (placement?.lat && placement?.lon) {
            map.flyTo([Number(placement.lat), Number(placement.lon)], map.getZoom(), {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            const center = map.getCenter();
            const bounds = map.getBounds();
            const radius = center.distanceTo(bounds.getNorthEast());
            setSelectedLocation({ lat: Number(placement.lat), lng: Number(placement.lon), radius })
        }
    }, [placement.lat, placement.lon, map]);

    useEffect(() => {
        if (
            shouldFlyToLandingPlan &&
            landingPlan &&
            landingPlan.lat &&
            landingPlan.lng
        ) {
            map.flyTo([Number(landingPlan.lat), Number(landingPlan.lng)], map.getZoom(), {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            setShouldFlyToLandingPlan(false);
        }
    }, [landingPlan, shouldFlyToLandingPlan, map]);

    useEffect(() => {
        if (latParams && lngParams) {
            map.flyTo([latParams, lngParams], 18, {
                animate: true,
                duration: 1,
            });
            return
        }
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
    const { searchCoordinatesLocation, pointsArea, setHoveredPostId } = useManagementLandingPlan();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);

    useMapEvents({

        moveend: async (e) => {
            if (isInitialMount.current && searchParams.get('post_id')) {
                isInitialMount.current = false;
                return;
            }

            const bounds = map.getBounds();
            const center = map.getCenter();
            const zoom = map.getZoom();
            const { lat, lng } = center;
            const radius = center.distanceTo(bounds.getNorthEast()); // bán kính tính bằng mét
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('lat', lat.toString());
                newParams.set('lng', lng.toString());
                newParams.delete('post_id'); // Remove post_id from URL
                return newParams;
            }, { replace: true });
            setHoveredPostId(null);

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
                const center = map.getCenter();
                const bounds = map.getBounds();
                const radius = center.distanceTo(bounds.getNorthEast());
                setSelectedLocation({ lat, lng, radius })
                searchCoordinatesLocation(lat, lng)
                return
            }
            if (pointsArea.isRouting) {
                setSelectedLocation({ lat, lng })
                pointsArea.isRouting = false
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

interface RoutingProps {
    from: [number, number];
    to: [number, number];
}

const RoutingMachine = observer(({ from, to }: RoutingProps) => {
    const map = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    useEffect(() => {
        if (!map || !from || !to) return;

        // Nếu đã có routing control cũ, xóa nó trước
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        // Tạo routing control mới
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ],
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 100
            },
            altLineOptions: {
                styles: [
                    { color: 'gray', opacity: 0.4, weight: 3 }
                ],
                extendToWaypoints: true,
                missingRouteTolerance: 100
            },
            router: L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1`,
                language: 'vi'
            }),
            fitSelectedRoutes: true,
            // addWaypoints: false,
            useZoomParameter: true,
            // show: false // Ẩn control panel mặc định
        });

        // Lưu reference để cleanup
        routingControlRef.current = routingControl;
        routingControl.addTo(map);

        // Clean up khi component unmount hoặc dependencies thay đổi
        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [map, from[0], from[1], to[0], to[1]]); // Thêm dependencies cụ thể

    return null;
});
