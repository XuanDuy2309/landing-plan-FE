import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { SearchLandingPlanReverseApi } from "src/core/api";
import { useCreatePostContext, useManagementLandingPlan } from "src/core/modules";


export const ModalMapEvents = observer(() => {
    const { setSelectedLocation } = useManagementLandingPlan()
    const map = useMap();
    const { searchCoordinatesLocation, pointsArea, coordinates } = useManagementLandingPlan()
    const { data } = useCreatePostContext()
    useMapEvents({

        moveend: async (e) => {
        },
        click: async (e) => {
            const { lat, lng } = e.latlng;
            if (!pointsArea.isDraw && !pointsArea.isRouting) {
                map.setView([lat, lng], map.getZoom());
                setSelectedLocation({ lat, lng })
                await SearchLandingPlanReverseApi.searchInterval({ lat, lon: lng })
                    .then((res) => {
                        const str = res.data.address.road + ', ' + res.data.address.quarter + ', ' + res.data.address.suburb + ', ' + res.data.address.city + ', ' + res.data.address.country
                        data.address = str
                        data.lng = lng
                        data.lat = lat
                    })
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