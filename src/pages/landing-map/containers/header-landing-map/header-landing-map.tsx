import { ListSearchBoxLandingPlanProvider } from 'src/core/modules'
import { SearchBoxLandingMap } from '../../components/header-landing-map/search-box-landing-map'

export const HeaderLandingMap = () => {
    return (
        <div className='absolute w-full z-[9999]'>
            <ListSearchBoxLandingPlanProvider>
                <SearchBoxLandingMap />
            </ListSearchBoxLandingPlanProvider>
        </div>
    )
}
