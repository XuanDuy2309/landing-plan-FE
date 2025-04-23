import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { useManagementLandingPlan } from "src/core/modules";


export const MapEvents = observer(() => {
    const { setSelectedLocation } = useManagementLandingPlan()
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