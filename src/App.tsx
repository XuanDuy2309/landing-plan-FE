import { Suspense, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { AppRouter } from "./routes";
import { initCoreStores } from "./core/stores";
import { ToastContainer } from "react-toastify";
import { Spin } from "antd";
import { UserContextProvider } from "./core/modules";
import { LoadingSystem, OverlaySystem } from "./components";

initCoreStores()
export const App = observer(() => {
  return (
    <UserContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-screen h-screen relative">
          <AppRouter />
          <ToastContainer />
          <LoadingSystem />
          <OverlaySystem />
        </div>
      </Suspense>
    </UserContextProvider>
  );

})