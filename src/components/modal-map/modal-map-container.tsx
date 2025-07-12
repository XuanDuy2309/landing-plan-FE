import { observer } from "mobx-react";
import { ManagementLandingPlanProvider, useCreatePostContext } from "src/core/modules";
import { LeafletMapCore } from "../leaf-map-core";
import { MapViewUpdater } from "../map-view-update";
import { ModalHeaderLandingMap } from "./header-modal-landing-map";
import { ModalMapEvents } from "./modal-map-event";
import { PopupDetailLocationContainer } from "./popup-detail-location";

export const ModalMapContainer = observer(() => {


    return <ManagementLandingPlanProvider>
        <MapContainer />
    </ManagementLandingPlanProvider>
});

export const MapContainer = observer(() => {
    const { data } = useCreatePostContext()

    return (
        <div className='relative flex-none h-full w-full bg-white'>
            <ModalHeaderLandingMap />
            <PopupDetailLocationContainer />
            <LeafletMapCore
                MapViewUpdater={(props) => <MapViewUpdater placement={props.placement} setSelectedLocation={props.setSelectedLocation} lat={data.lat} lng={data.lng}/>}
                MapEvent={(props) => <ModalMapEvents pointsArea={props.pointsArea} setSelectedLocation={props.setSelectedLocation} />} />
        </div>
    )
})
