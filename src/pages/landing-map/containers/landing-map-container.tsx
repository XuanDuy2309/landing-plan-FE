import { observer } from 'mobx-react'
import { useManagementLandingPlan } from 'src/core/modules'
import { ToolbarLandingMap } from '../components/tool-bar-landing-map/toolbar-landing-map'
import { ChatBotContainer } from './chat-bot/chat-bot-container'
import { HeaderLandingMap } from './header-landing-map/header-landing-map'
import { LeafletMapContainer } from './leaflet-map-container/leaflet-map-container'
import { PopupDetailCoordinatesLocationContainer } from './popup-detail-coordinates-location/popup-detail-coordinates-location-container'
import { SideBarLandingMapContainer } from './side-bar-landing-map-container'

export const LandingMapContainer = observer(() => {
    const { openSidebar } = useManagementLandingPlan()
    return (
        <div className='w-full h-screen flex'>
            <div className={`h-full flex-none transition-[width] duration-300 ${openSidebar ? 'w-[450px]' : 'w-0 overflow-hidden'
                }`}>
                <SideBarLandingMapContainer />
            </div>
            <div className='relative h-screen w-full'>
                <HeaderLandingMap />
                <ToolbarLandingMap />
                <PopupDetailCoordinatesLocationContainer />
                <ChatBotContainer />
                <div className='w-full h-full'> <LeafletMapContainer /></div>
            </div>
        </div>
    )
})
