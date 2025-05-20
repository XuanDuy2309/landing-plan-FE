import { Spin } from "antd";
import { observer } from "mobx-react";
import { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { LoadingSystem, OverlaySystem } from "./components";
import { NotificationProvider } from "./core/context";
import { UserContextProvider } from "./core/modules";
import { initCoreStores } from "./core/stores";
import { AppRouter } from "./routes";

export const App = observer(() => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initCoreStores().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <UserContextProvider>
      <Suspense fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      }>
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
});