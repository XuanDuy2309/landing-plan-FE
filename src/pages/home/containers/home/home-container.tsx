import { observer } from "mobx-react";
import { CreatePostContainer } from "./create-post-container";

export const HomeContainer = observer(() => {
    return (
        <div className="w-full h-full flex flex-col items-center space-y-4">
            <CreatePostContainer />
        </div>
    );
})