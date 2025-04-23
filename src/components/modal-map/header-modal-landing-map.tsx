import { ListSearchBoxLandingPlanProvider } from 'src/core/modules'
import { ModalSearchBoxLandingMap } from './search-box-modal-landing-map'

export const ModalHeaderLandingMap = () => {
    return (
        <div className='absolute w-full z-[9999]'>
            <ListSearchBoxLandingPlanProvider>
                <ModalSearchBoxLandingMap />
            </ListSearchBoxLandingPlanProvider>
        </div>
    )
}
