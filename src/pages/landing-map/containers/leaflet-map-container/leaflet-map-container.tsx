import debounce from "debounce";
import L from "leaflet";
import 'leaflet-routing-machine'; // Thêm import này
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import { observer } from 'mobx-react';
import { Fragment, memo, useEffect, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { LayersControl, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { Colors } from 'src/assets';
import { getColorFromId, isValidPolygon } from 'src/core/base';
import { NominatimResult, SelectedLocationModel } from 'src/core/models';
import { FilterPostContextType, useManagementLandingPlan, usePostContext } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import { PopupPostLandingMapContainer } from "../popup-post-landing-map-container";
import './leaflet-map-container.css';

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

    console.log("placement", placement);
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
            {pointsArea.routeTo && pointsArea.isRouting && <RoutingMachine from={[location.lat, location.lng]} to={[pointsArea.routeTo[0], pointsArea.routeTo[1]]} />}
            <LayersControl>
                <LayersControl.BaseLayer checked name="Map mặc định">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={22}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map vệ tinh">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={22}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map địa hình">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=m,t&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={22}
                        minZoom={8}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            {landingPlanMap && landingPlanMap.folder_path && <TileLayer
                url={`${landingPlanMap?.folder_path}{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={opacity}
                zIndex={999}
                tms={true}
            />}
            <TileLayer
                url={`https://cdn.dandautu.vn/quy-hoach/ha_noi/hoang_mai__ha_noi/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={0.8}
                zIndex={999}
                tms={true}
            // opacity={opacit}
            />

            {selectedLocation.lat && selectedLocation.lng && (
                <Marker position={[Number(selectedLocation.lat), Number(selectedLocation.lng)]}>
                    <Popup>
                        <div>
                            <span>Vị trí hiện tại: { }</span>
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

            <RenderedPostMarkers />

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

    useEffect(() => {
        if (!map || !from || !to) return;
        console.log("form, to", from, to);

        // Tạo routing control
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ],
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
            // plan: L.Routing.plan(
            //     [
            //         L.latLng(from[0], from[1]),
            //         L.latLng(to[0], to[1])
            //     ],
            //     {
            //         createMarker: function (i, waypoint) {
            //             return L.marker(waypoint.latLng, {
            //                 icon: L.divIcon({
            //                     className: "routing-marker",
            //                     html: `<div style="width: 16px; height: 16px; background: ${i === 0 ? 'green' : 'red'}; border-radius: 50%; border: 2px solid white;"></div>`,
            //                 })
            //             });
            //         }
            //     }
            // ),
            // addWaypoints: false,
            // routeWhileDragging: fal  se,
            // draggableWaypoints: false,
            // showAlternatives: false,
            altLineOptions: {
                styles: [
                    { color: 'gray', opacity: 0.4, weight: 3 }
                ],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
            router: L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1`,
                language: 'vi' // Dù có set nhưng thường OSRM chỉ hỗ trợ 1 số ngôn ngữ
            }),
            // formatter: new L.Routing.Formatter({
            //     // Đây là nơi bạn có thể tùy chỉnh text hướng dẫn
            //     language: "vi",
            //     formatInstruction: function (instr) {
            //         return instr.text
            //             .replace("Turn right", "Rẽ phải")
            //             .replace("Turn left", "Rẽ trái")
            //             .replace("Continue straight", "Đi thẳng")
            //             .replace("Take the first exit", "Rẽ ra ở lối ra đầu tiên")
            //             .replace("at the roundabout", "ở vòng xoay")
            //             .replace("You have reached your destination", "Bạn đã đến nơi");
            //     },
            // }),
            fitSelectedRoutes: true,
        }).addTo(map);

        // Clean up khi component unmount
        return () => {
            map.removeControl(routingControl);
        };
    }, [from, to]);

    return null;
});

const RenderedPostMarkers = memo(() => {
    const map = useMap();
    const { data } = usePostContext();
    const { hoveredPostId } = useManagementLandingPlan();

    useEffect(() => {
        if (!hoveredPostId) {
            map.closePopup();
            return;
        }

        const post = data.find(p => p.id === hoveredPostId);
        if (!post || !post.lat || !post.lng) return;

        const popup = L.popup({
            className: 'custom-popup',
            autoPan: true,
        })
            .setLatLng([post.lat, post.lng])
            .setContent(
                ReactDOMServer.renderToString(
                    <PopupPostLandingMapContainer
                        item={post}
                        onCancel={() => map.closePopup()}
                        onConfirm={(value) => {
                            map.closePopup();
                            window.open(`/post/${value.id}`);
                        }}
                    />
                )
            );

        map.openPopup(popup);

        return () => {
            map.closePopup();
        };
    }, [hoveredPostId, data, map]);

    return (
        <>
            {data.map((item, index) => {
                const { lat, lng, coordinates } = item;
                const hasPolygon = Array.isArray(coordinates) && coordinates.length >= 3;

                return (
                    <Fragment key={item.id || index}>
                        {lat && lng && (
                            <Marker
                                position={[lat, lng]}
                                icon={L.divIcon({
                                    className: 'custom-marker',
                                    html: `<div style="width: 16px; height: 16px; background: green; border-radius: 50%; border: 2px solid white;"></div>`,
                                })}
                            >
                                <Popup>
                                    <PopupPostLandingMapContainer
                                        item={item}
                                        onCancel={() => map.closePopup()}
                                        onConfirm={(value) => {
                                            map.closePopup();
                                            window.open(`/post/${value.id}`);
                                        }}
                                    />
                                </Popup>
                            </Marker>
                        )}

                        {hasPolygon && (
                            <Polygon
                                positions={coordinates.map(([lng, lat]: number[]) => [lat, lng])}
                                pathOptions={{
                                    color: hoveredPostId === item.id ? 'orange' : getColorFromId(item.id!),
                                    fillOpacity: 0.2,
                                    weight: 2,
                                }}
                            >
                                {map.getZoom() > 18 && <Tooltip direction="center" permanent>{item.title} - {item.area} m²</Tooltip>}
                            </Polygon>
                        )}
                    </Fragment>
                );
            })}
        </>
    );
});

