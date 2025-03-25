import { observer } from 'mobx-react'
import { ToolbarLandingMap } from '../components/tool-bar-landing-map/toolbar-landing-map'
import { HeaderLandingMap } from './header-landing-map/header-landing-map'
import { LeafletMapContainer } from './leaflet-map-container/leaflet-map-container'

export const LandingMapContainer = observer(() => {
    return (
        <div className='relative h-screen w-full'>
            <HeaderLandingMap />
            <ToolbarLandingMap />
            <LeafletMapContainer />
        </div>
    )
})
