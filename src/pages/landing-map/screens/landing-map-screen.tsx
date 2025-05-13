import { observer } from "mobx-react";
import { ManagementLandingPlanProvider, PostContextProvider } from "src/core/modules";
import { LandingMapContainer } from "../containers/landing-map-container";

export const LandingMapScreen = observer(() => {
    return <ManagementLandingPlanProvider>
        <PostContextProvider>
            <LandingMapContainer />
        </PostContextProvider>
    </ManagementLandingPlanProvider>
});