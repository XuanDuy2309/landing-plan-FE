import L from "leaflet";
import 'leaflet-routing-machine'; // Thêm import này
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { LayersControl, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { Colors } from 'src/assets';
import { isValidPolygon } from 'src/core/base';
import { NominatimResult, SelectedLocationModel } from 'src/core/models';
import { useManagementLandingPlan } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import './leaflet-map-container.css';


export const LeafletMapContainer = observer(() => {
    const { location } = useCoreStores().sessionStore
    const { placement, polygon, selectedLocation, setSelectedLocation, isDraw, coordinates, pointsArea } = useManagementLandingPlan()
    const calculateDistance = useMemo(() => {
        return pointsArea.calculateDistance() || 0
    }, [pointsArea.currentMousePos, pointsArea.points]);

    return (
        <MapContainer
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            center={[location.lat, location.lng]}
            zoom={14}
            maxZoom={30}
        >
            <MapEvents setSelectedLocation={setSelectedLocation} />
            <MapViewUpdater placement={placement} setSelectedLocation={setSelectedLocation} />
            {pointsArea.routeTo && <RoutingMachine from={[location.lat, location.lng]} to={[pointsArea.routeTo[0], pointsArea.routeTo[1]]} />}
            <LayersControl>
                <LayersControl.BaseLayer checked name="Map mặc định">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map vệ tinh">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <TileLayer
                url={`http://localhost:3000/tiles/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={0.8}
                zIndex={999}
            // opacity={opacit}
            />
            {/* <TileLayer
                url={`https://s3-hn-2.cloud.cmctelecom.vn/guland7/land/ha-noi/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={0.8}
                zIndex={999}
            // opacity={opacit}
            /> */}

            {selectedLocation.lat && selectedLocation.lng && (
                <Marker position={[Number(selectedLocation.lat), Number(selectedLocation.lng)]}>
                    <Popup>
                        <div>
                            {/* <span>{placementInfo?.display_name}</span> */}
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
                            html: `<div style="width: 14px; height: 14px; background: red; border-radius: 50%; border: 2px solid white;"></div>`,
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
                    html: `<div style="width: 14px; height: 14px; background: blue; border-radius: 50%; border: 2px solid white;"></div>`,
                })}
            />
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
        return () => {
            window.removeEventListener('go-to-current-location', handleGoToLocation);
        };
    }, [map, location.lat, location.lng]);

    return null;
});

interface IProps3 {
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
}
const MapEvents = observer(({ setSelectedLocation }: IProps3) => {
    // const { getInfoPlacement } = useManagementLandingPlan()
    const map = useMap();
    const { searchCoordinatesLocation, pointsArea } = useManagementLandingPlan()
    useMapEvents({

        moveend: async (e) => {
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
            // lineOptions: {
            //     styles: [{ color: 'blue', weight: 4 }]
            // },
            // createMarker: function (i, waypoint, n) {
            //     // Tùy chỉnh marker nếu cần
            //     return L.marker(waypoint.latLng, {
            //         icon: L.divIcon({
            //             className: "routing-marker",
            //             html: `<div style="width: 14px; height: 14px; background: ${i === 0 ? 'green' : 'red'}; border-radius: 50%; border: 2px solid white;"></div>`,
            //         })
            //     });
            // },
            // addWaypoints: false,
            // routeWhileDragging: false,
            // draggableWaypoints: false,
            // showAlternatives: false,
            // altLineOptions: {
            //     styles: [
            //         { color: 'gray', opacity: 0.4, weight: 3 }
            //     ]
            // },
            // fitSelectedRoutes: true,
        }).addTo(map);

        // Clean up khi component unmount
        return () => {
            map.removeControl(routingControl);
        };
    }, [from, to]);

    return null;
});