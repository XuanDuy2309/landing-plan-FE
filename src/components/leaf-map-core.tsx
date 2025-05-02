import L from "leaflet";
import { Polygon } from "react-leaflet";
import { observer } from "mobx-react";
import { JSX, useEffect, useMemo } from "react";
import { LayersControl, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import { useManagementLandingPlan } from "src/core/modules";
import { useCoreStores } from "src/core/stores";
import { Colors } from "src/assets";
import { isValidPolygon } from "src/core/base";
import { NominatimResult, PointsMapModel, SelectedLocationModel } from "src/core/models";

interface IProps {
    MapEvent?: (Props: { pointsArea: PointsMapModel, setSelectedLocation: (selectedLocation: SelectedLocationModel) => void }) => JSX.Element;
    MapViewUpdater?: (Props: { placement: NominatimResult, setSelectedLocation: (selectedLocation: SelectedLocationModel) => void }) => JSX.Element;
    RoutingMachine?: (props: { from: [number, number], to: [number, number] }) => JSX.Element
}

export const LeafletMapCore = observer(({ MapEvent, MapViewUpdater, RoutingMachine }: IProps) => {
    const { sessionStore } = useCoreStores()
    const { location } = sessionStore
    const { polygon, selectedLocation, setSelectedLocation, placement, isDraw, coordinates, pointsArea, landingPlanMap, opacity } = useManagementLandingPlan()
    const calculateDistance = useMemo(() => {
        return pointsArea.calculateDistance() || 0
    }, [pointsArea.currentMousePos, pointsArea.points]);

    useEffect(() => {
        sessionStore.requestLocation();
    }, [])
    return (
        <MapContainer
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            center={[location.lat, location.lng]}
            zoom={14}
            maxZoom={30}
            attributionControl={true}
        >
            {MapEvent && <MapEvent setSelectedLocation={setSelectedLocation} pointsArea={pointsArea} />}
            {MapViewUpdater && <MapViewUpdater placement={placement} setSelectedLocation={setSelectedLocation} />}
            {RoutingMachine && pointsArea.routeTo && pointsArea.isRouting && <RoutingMachine from={[location.lat, location.lng]} to={[pointsArea.routeTo[0], pointsArea.routeTo[1]]} />}
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
            {landingPlanMap && landingPlanMap.folder_path && <TileLayer
                url={`http://localhost:3000/${landingPlanMap?.folder_path}/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={opacity}
                zIndex={999}
                tms={true}
            />}

            {selectedLocation.lat && selectedLocation.lng && (
                <Marker position={[Number(selectedLocation.lat), Number(selectedLocation.lng)]}>
                    <Popup>
                        <div>
                            {
                            }
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