import L from "leaflet";
import 'leaflet-routing-machine'; // Thêm import này
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { memo, useEffect, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";

interface IProps {
    from: [number, number];
    to: [number, number];
    isRouting?: boolean
    onChangeLocation?: (lat: number, lng: number) => void
}

export const RoutingMachineLeafletMap = memo(({ from, to, isRouting, onChangeLocation }: IProps) => {
    const map = useMap();
    // Memoize the routing options to prevent recreating on every render
    const routingOptions = useMemo(() => ({
        waypoints: [
            L.latLng(from[0], from[1]),
            L.latLng(to[0], to[1])
        ],
        lineOptions: {
            styles: [{ color: 'blue', weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 10
        },
        altLineOptions: {
            styles: [
                { color: 'gray', opacity: 0.4, weight: 3 }
            ],
            extendToWaypoints: true,
            missingRouteTolerance: 10
        },
        router: L.Routing.osrmv1({
            serviceUrl: `https://router.project-osrm.org/route/v1`,
            language: 'vi'
        }),
        fitSelectedRoutes: true,
    }), [from, to]);

    const routingControlRef = useRef<L.Routing.Control | null>(null);
    useEffect(() => {
        if (!map || !from || !to || !isRouting) {
            // Remove routing if isRouting is false
            if (routingControlRef.current && map.hasLayer(routingControlRef.current as any)) {
                try {
                    map.removeControl(routingControlRef.current);
                    routingControlRef.current = null;
                } catch (e) {
                    console.warn("Failed to remove routing control:", e);
                }
            }
            return;
        }

        // Add routing if isRouting is true
        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control(routingOptions);
            routingControlRef.current.addTo(map);
            onChangeLocation && onChangeLocation(to[0], to[1]);
        } else {
            routingControlRef.current.setWaypoints([
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ]);
            onChangeLocation && onChangeLocation(to[0], to[1]);
        }

        return () => {
            if (routingControlRef.current && map.hasLayer(routingControlRef.current as any)) {
                try {
                    map.removeControl(routingControlRef.current);
                    routingControlRef.current = null;
                } catch (e) {
                    console.warn("Failed to remove routing control:", e);
                }
            }
        };
    }, [map, from, to, routingOptions, isRouting]);

    return null;

});
