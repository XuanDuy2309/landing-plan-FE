import { ManagementLandingPlanProvider, useManagementLandingPlan } from "src/core/modules";
import { observer } from "mobx-react";
import { ModalHeaderLandingMap } from "./header-modal-landing-map";
import { LeafletMapCore } from "../leaf-map-core";
import { MapViewUpdater } from "../map-view-update";
import { RoutingMachine } from "../map-routing";
import { ModalMapEvents } from "./modal-map-event";

export const ModalMapContainer = observer(() => {


    return <ManagementLandingPlanProvider>
        <MapContainer />
    </ManagementLandingPlanProvider>
});

export const MapContainer = observer(() => {
    const { placement, polygon, selectedLocation, setSelectedLocation, isDraw, coordinates, pointsArea, landingPlanMap, opacity } = useManagementLandingPlan()

    return (
        <div className='relative flex-none h-[488px] w-full bg-white'>
            <ModalHeaderLandingMap />
            <LeafletMapCore
                RoutingMachine={() => <RoutingMachine />}
                MapViewUpdater={() => <MapViewUpdater />}
                MapEvent={() => <ModalMapEvents />} />
        </div>
    )
})
