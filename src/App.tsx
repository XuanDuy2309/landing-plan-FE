import { observer } from "mobx-react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { LoadingSystem, OverlaySystem } from "./components";
import { NotificationProvider } from "./core/context";
import { UserContextProvider } from "./core/modules";
import { initCoreStores } from "./core/stores";
import { AppRouter } from "./routes";

initCoreStores()
export const App = observer(() => {
  return (
    <UserContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationProvider>
          <div className="w-screen h-screen relative">
            <AppRouter />
            <ToastContainer />
            <LoadingSystem />
            <OverlaySystem />
          </div>
        </NotificationProvider>
      </Suspense>
    </UserContextProvider>
  );

})