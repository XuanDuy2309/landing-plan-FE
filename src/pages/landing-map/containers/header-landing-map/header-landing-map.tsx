import { observer } from 'mobx-react';
import { ListSearchBoxLandingPlanProvider } from 'src/core/modules';
import { SearchBoxLandingMap } from '../../components/header-landing-map/search-box-landing-map';

export const HeaderLandingMap = observer(() => {

    return (
        <div className='absolute w-full z-[9999]'>
            <ListSearchBoxLandingPlanProvider>
                <SearchBoxLandingMap />
            </ListSearchBoxLandingPlanProvider>
        </div>
    )
}
)