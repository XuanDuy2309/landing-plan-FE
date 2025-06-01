import L from "leaflet";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { observer } from "mobx-react";
import { useEffect, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";

interface IProps {
    from: [number, number];
    to: [number, number];
    isRouting?: boolean;
    onChangeLocation?: (lat: number, lng: number) => void;
}

export const RoutingMachineLeafletMap = observer(({ from, to, isRouting }: IProps) => {
    const map = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);
    console.log(isRouting)
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

    useEffect(() => {
        // Cleanup function to remove routing control
        const cleanupRouting = () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };

        // If isRouting is false, cleanup and return
        if (!isRouting) {
            cleanupRouting();
            return;
        }

        // Khởi tạo routing options mỗi lần cần tạo route mới
        const routingOptions = {
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
        };

        routingControlRef.current = L.Routing.control(routingOptions);
        routingControlRef.current.addTo(map);

        // Cleanup on unmount or when any dependency changes
        return () => {
            cleanupRouting();
        };
    }, [map, isRouting, from, to]); // nhớ include from/to

    // Return null since the routing control is handled by the effect
    return null;
});
