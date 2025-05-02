import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { HeaderHome } from "./components/header-home";

export const HomeLayout = observer(() => {
    return (
        <div className="w-full h-full flex flex-col min-h-0">
            <HeaderHome />
            <div className="w-full h-full flex-none bg-gray-200 min-h-0">
                <Outlet />
            </div >
        </div>
    )
})