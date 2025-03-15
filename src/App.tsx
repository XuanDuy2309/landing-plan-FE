import { Suspense, useMemo } from "react";
import { observer } from "mobx-react";
import { AppRouter } from "./routes";
import { initCoreStores } from "./core/stores";
import { ToastContainer } from "react-toastify";

export const App = observer(() => {
  useMemo(() => {
    initCoreStores()
  }, [])
  return (
    <AppContainer />
  );

})

const AppContainer = observer(() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen">
        <AppRouter />
        <ToastContainer />
      </div>
    </Suspense>
  );
})