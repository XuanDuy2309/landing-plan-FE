import { ManagementLandingPlanProvider } from "src/core/modules";
import { LandingMapContainer } from "../containers/landing-map-container";

export const LandingMapScreen = () => {
    return <ManagementLandingPlanProvider>
        <LandingMapContainer />
    </ManagementLandingPlanProvider>
};