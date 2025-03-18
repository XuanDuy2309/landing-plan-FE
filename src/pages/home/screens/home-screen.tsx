import { observer } from "mobx-react";
import { useCoreStores } from "../../../core/stores";
import { AuthApi } from "../../../core/api";

export const HomeScreen = observer(() => {
    const { sessionStore } = useCoreStores();
    return <div>
        <button onClick={() => {}}>logout</button>
    </div>;
})