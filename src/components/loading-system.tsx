import { Spin } from "antd";
import { observer } from "mobx-react";
import { useCoreStores } from "src/core/stores";

export const LoadingSystem = observer(() => {
    const { sessionStore } = useCoreStores();
    if (!sessionStore.isLoading) return null;
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center z-10">
            <Spin />
        </div>
    );
});