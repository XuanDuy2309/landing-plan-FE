import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { NominatimResult, SelectedLocationModel } from "src/core/models";
import { useCoreStores } from "src/core/stores";

interface Props {
    placement: NominatimResult
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
    lat?: number
    lng?: number
}

export const MapViewUpdater = observer(({ placement, setSelectedLocation, lat, lng }: Props) => {
    const map = useMap();
    const { location } = useCoreStores().sessionStore;

    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom(), {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            setSelectedLocation({ lat, lng });
            return
        }
        if (placement.lat && placement.lon) {
            const lat = Number(placement.lat)
            const lng = Number(placement.lon)
            map.flyTo([lat, lng], 18, {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            setSelectedLocation({ lat, lng });
            return
        }

    }, [lat, lng, placement]);

    return null;
});