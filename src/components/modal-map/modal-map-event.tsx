import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { PointsMapModel, SelectedLocationModel } from "src/core/models";



interface IProps {
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
    pointsArea: PointsMapModel
}

export const ModalMapEvents = observer(({ setSelectedLocation, pointsArea }: IProps) => {
    const map = useMap();

    useMapEvents({

        moveend: async (e) => {
        },
        click: async (e) => {
            const { lat, lng } = e.latlng;
            if (!pointsArea.isDraw && !pointsArea.isRouting) {
                map.setView([lat, lng], map.getZoom());
                setSelectedLocation({ lat, lng })
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