import { observer } from "mobx-react";
import { LandTypeChangeContextProvider } from "src/core/modules";
import { HeaderLandTypeChangeContainer } from "../components/land-type-change/header-land-type-change-container";
import { ListLandTypeChangeContainer } from "../containers/land-type-change/list-land-type-change-container";



export const LandTypeChangeScreen = observer(() => {

    return (
        <LandTypeChangeContextProvider>
            <div className="w-full h-full flex flex-col overflow-y-auto min-h-0">
                {/* Header */}
                <HeaderLandTypeChangeContainer />

                {/* Filters */}
                <ListLandTypeChangeContainer />
                {/* Edit Modal */}
                
            </div>
        </LandTypeChangeContextProvider>
    );
});
