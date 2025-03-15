import { observer } from "mobx-react";
import { useCoreStores } from "../../../core/stores";
import { AuthApi } from "../../../core/api";

export const HomeScreen = observer(() => {
    const { sessionStore } = useCoreStores();
    const handleLogout = async () => {
        sessionStore.logout();
    }
    return <div>
        <button onClick={handleLogout}>logout</button>
    </div>;
})