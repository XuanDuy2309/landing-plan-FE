import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { HeaderHome } from "./components/header-home";

export const HomeLayout = observer(() => {
    return (
        <div className="w-full h-full flex flex-col relative">
            <div className="sticky h-14 flex-none">
                <HeaderHome />
            </div>
            <div className="w-full h-full flex flex-col overflow-y-auto">
                <div className="w-full h-full flex-none bg-gray-200">
                    <Outlet />
                </div >
            </div>
        </div>
    )
})