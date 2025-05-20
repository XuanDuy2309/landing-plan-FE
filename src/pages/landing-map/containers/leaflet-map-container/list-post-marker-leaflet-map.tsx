import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { observer } from "mobx-react";
import { Fragment, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Marker, Polygon, Popup, Tooltip, useMap } from 'react-leaflet';
import { Colors } from 'src/assets';
import { getColorFromId } from 'src/core/base';
import { useManagementLandingPlan, usePostContext } from 'src/core/modules';
import { PopupPostLandingMapContainer } from "../popup-post-landing-map-container";
import './leaflet-map-container.css';

export const ListPostMarkerLeafletMap = observer(() => {
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
                                    color: hoveredPostId === item.id ? Colors.red[500] : getColorFromId(item.id!),
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

