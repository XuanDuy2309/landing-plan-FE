import { observer } from 'mobx-react';
import { ListSearchBoxLandingPlanProvider } from 'src/core/modules';
import { useCoreStores } from 'src/core/stores';
import { FilterLandingType } from '../../components/header-landing-map/filter-landing-type';
import { SearchBoxLandingMap } from '../../components/header-landing-map/search-box-landing-map';

export const HeaderLandingMap = observer(() => {
    const { sessionStore } = useCoreStores()
    return (
        <div className='absolute w-full z-[9999] flex items-center'>
            <ListSearchBoxLandingPlanProvider>
                <SearchBoxLandingMap />
            </ListSearchBoxLandingPlanProvider>
            {sessionStore.profile && <FilterLandingType />}
        </div>
    )
}
)
