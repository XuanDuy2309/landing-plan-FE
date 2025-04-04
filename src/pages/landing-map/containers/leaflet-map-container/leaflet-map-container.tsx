import 'leaflet/dist/leaflet.css';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { LayersControl, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { NominatimResult, SelectedLocationModel } from 'src/core/models';
import { useManagementLandingPlan } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import './leaflet-map-container.css';
import { Colors } from 'src/assets';

export const LeafletMapContainer = observer(() => {
    const { location } = useCoreStores().sessionStore
    const { placement, polygon, selectedLocation, setSelectedLocation, isDraw, coordinates } = useManagementLandingPlan()
    return (
        <MapContainer
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            center={[location.lat, location.lng]}
            zoom={14}
            maxZoom={30}
        >
            <MapEvents setSelectedLocation={setSelectedLocation} />
            <MapViewUpdater placement={placement} setSelectedLocation={setSelectedLocation} />
            <LayersControl>
                <LayersControl.BaseLayer checked name="Map vệ tinh">
                    <TileLayer
                        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        maxZoom={30}
                        attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map mặc định">
                    <TileLayer
                        maxZoom={22}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <TileLayer
                url={`http://localhost:3000/tiles/{z}/{x}/{y}.png`}
                // pane="overlayPane"
                minZoom={12}
                maxZoom={18}
                opacity={1}
                zIndex={999}
            // opacity={opacit}
            />

            {selectedLocation.lat && selectedLocation.lng && (
                <Marker position={[Number(selectedLocation.lat), Number(selectedLocation.lng)]}>
                    {/* <Popup>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>
                                Tỉnh {locationInfo?.provinceName}, Huyện {locationInfo?.districtName}
                            </h3>
                            <p>
                                Vị trí: {locationInfo?.lat.toFixed(5)}, {locationInfo?.lng.toFixed(5)}
                            </p>
                            <button
                                className="button--share"
                                onClick={() => handleShareClick(locationInfo?.lat, locationInfo?.lng)}
                            >
                                <FaShareAlt />
                                Chia sẻ
                            </button>
                        </div>
                    </Popup> */}
                </Marker>
            )}
            {polygon && <Polygon pathOptions={{ fillColor: 'transparent', weight: 5 }} positions={polygon} />}
            {coordinates.points && <Polygon pathOptions={{ fillColor: Colors.red[200], weight: 5, color:Colors.red[300] }} positions={coordinates.points} />}
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

    return null;
});

interface IProps3 {
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
}
const MapEvents = observer(({ setSelectedLocation }: IProps3) => {
    const map = useMap();
    const { searchCoordinatesLocation } = useManagementLandingPlan()
    useMapEvents({

        moveend: async (e) => {
        },
        click: async (e) => {
            const { lat, lng } = e.latlng;
            map.setView([lat, lng], map.getZoom());
            setSelectedLocation({ lat, lng })
            searchCoordinatesLocation(lat, lng)
        },
    });

    return null;
});

