import L from "leaflet";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useManagementLandingPlan } from "src/core/modules";
import { useCoreStores } from "src/core/stores";



export const RoutingMachine = observer(() => {
    const { pointsArea } = useManagementLandingPlan();
    const { location } = useCoreStores().sessionStore
    const map = useMap();

    useEffect(() => {
        if (!map || !location || !pointsArea.routeTo) return;

        // Tạo routing control
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(location.lat, location.lng),
                L.latLng(pointsArea.routeTo[0], pointsArea.routeTo[1])
            ],
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
            // plan: L.Routing.plan(
            //     [
            //         L.latLng(from[0], from[1]),
            //         L.latLng(to[0], to[1])
            //     ],
            //     {
            //         createMarker: function (i, waypoint) {
            //             return L.marker(waypoint.latLng, {
            //                 icon: L.divIcon({
            //                     className: "routing-marker",
            //                     html: `<div style="width: 14px; height: 14px; background: ${i === 0 ? 'green' : 'red'}; border-radius: 50%; border: 2px solid white;"></div>`,
            //                 })
            //             });
            //         }
            //     }
            // ),
            // addWaypoints: false,
            // routeWhileDragging: fal  se,
            // draggableWaypoints: false,
            // showAlternatives: false,
            altLineOptions: {
                styles: [
                    { color: 'gray', opacity: 0.4, weight: 3 }
                ],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
            router: L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1`,
                language: 'vi' // Dù có set nhưng thường OSRM chỉ hỗ trợ 1 số ngôn ngữ
            }),
            // formatter: new L.Routing.Formatter({
            //     // Đây là nơi bạn có thể tùy chỉnh text hướng dẫn
            //     language: "vi",
            //     formatInstruction: function (instr) {
            //         return instr.text
            //             .replace("Turn right", "Rẽ phải")
            //             .replace("Turn left", "Rẽ trái")
            //             .replace("Continue straight", "Đi thẳng")
            //             .replace("Take the first exit", "Rẽ ra ở lối ra đầu tiên")
            //             .replace("at the roundabout", "ở vòng xoay")
            //             .replace("You have reached your destination", "Bạn đã đến nơi");
            //     },
            // }),
            fitSelectedRoutes: true,
        }).addTo(map);

        // Clean up khi component unmount
        return () => {
            map.removeControl(routingControl);
        };
    }, [location, pointsArea.routeTo]);

    return null;
});