import { observer } from "mobx-react";
import { useCoreStores } from "src/core/stores";

export const OverlaySystem = observer(() => {
    const {sessionStore} = useCoreStores()
    if (!sessionStore.isLoading) return null;
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center bg-gray-100 opacity-35">
        </div>
    );
})