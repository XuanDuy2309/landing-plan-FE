import { ManagementLandingPlanProvider, useManagementLandingPlan } from "src/core/modules";
import { observer } from "mobx-react";
import { ModalHeaderLandingMap } from "./header-modal-landing-map";
import { LeafletMapCore } from "../leaf-map-core";
import { MapViewUpdater } from "../map-view-update";
import { RoutingMachine } from "../map-routing";
import { ModalMapEvents } from "./modal-map-event";
import { PopupDetailCoordinatesLocationContainer } from "src/pages/landing-map/containers/popup-detail-coordinates-location/popup-detail-coordinates-location-container";
import { PopupDetailLocationContainer } from "./popup-detail-location";

export const ModalMapContainer = observer(() => {


    return <ManagementLandingPlanProvider>
        <MapContainer />
    </ManagementLandingPlanProvider>
});

export const MapContainer = observer(() => {

    return (
        <div className='relative flex-none h-full w-full bg-white'>
            <ModalHeaderLandingMap />
            <PopupDetailLocationContainer />
            <LeafletMapCore
                MapViewUpdater={(props) => <MapViewUpdater placement={props.placement} setSelectedLocation={props.setSelectedLocation} />}
                MapEvent={(props) => <ModalMapEvents pointsArea={props.pointsArea} setSelectedLocation={props.setSelectedLocation} />} />
        </div>
    )
})
