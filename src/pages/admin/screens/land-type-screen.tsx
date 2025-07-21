import { observer } from "mobx-react";
import { ListLandTypeContextProvider } from "src/core/modules";
import { ListLandTypeContainer } from "src/pages/admin/containers/land-type/list-land-type-container";
import { HeaderLandTypeContainer } from "../components/land-type/header-land-type-container";



export const LandTypesScreen = observer(() => {

    return (
        <ListLandTypeContextProvider>
            <div className="w-full h-full flex flex-col overflow-y-auto min-h-0">
                {/* Header */}
                <HeaderLandTypeContainer />

                {/* Filters */}
                <ListLandTypeContainer />
                {/* Edit Modal */}
                
            </div>
        </ListLandTypeContextProvider>
    );
});
