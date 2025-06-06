import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { NominatimResult, SelectedLocationModel } from "src/core/models";
import { useManagementLandingPlan } from "src/core/modules";
import { useCoreStores } from "src/core/stores";

interface Props {
    placement: NominatimResult
    setSelectedLocation: (selectedLocation: SelectedLocationModel) => void
}

export const MapViewUpdater = observer(({ placement, setSelectedLocation }: Props) => {
    const map = useMap();
    const { location } = useCoreStores().sessionStore;

    useEffect(() => {
        if (placement && placement?.lat && placement?.lon) {
            const lat = Number(placement.lat);
            const lng = Number(placement.lon);
            map.flyTo([lat, lng], map.getZoom(), {
                animate: true,
                easeLinearity: 0.2,
                duration: 1.5,
            });
            setSelectedLocation({ lat, lng });
        }
    }, [placement]);

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