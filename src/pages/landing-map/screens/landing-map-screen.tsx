import { ManagementLandingPlanProvider } from "src/core/modules";
import { LandingMapContainer } from "../containers/landing-map-container";
import { observer } from "mobx-react";

export const LandingMapScreen = observer(() => {
    return <ManagementLandingPlanProvider>
        <LandingMapContainer />
    </ManagementLandingPlanProvider>
});