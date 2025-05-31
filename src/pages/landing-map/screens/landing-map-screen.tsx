import { observer } from "mobx-react";
import { ListChatbotContextProvider, ManagementLandingPlanProvider, PostContextProvider } from "src/core/modules";
import { LandingMapContainer } from "../containers/landing-map-container";

export const LandingMapScreen = observer(() => {
    return <ManagementLandingPlanProvider>
        <PostContextProvider>
            <ListChatbotContextProvider>
                <LandingMapContainer />
            </ListChatbotContextProvider>
        </PostContextProvider>
    </ManagementLandingPlanProvider>
});
