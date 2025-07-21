import { CreateLandTypeChangeContextProvider } from 'src/core/modules'
import { FooterLandTypeChangeContainer } from '../../components/land-type-change/footer-create-land-type-change-container'
import { CreateLandTypeChangeContent } from './create-land-type-change-content'

export const CreateLandTypeChangeContainer = () => {
    return (
        <CreateLandTypeChangeContextProvider>
            <CreateLandTypeChangeContent />
            <FooterLandTypeChangeContainer />
        </CreateLandTypeChangeContextProvider>
    )
}
