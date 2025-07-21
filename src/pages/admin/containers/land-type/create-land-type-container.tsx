import { CreateLandTypeContextProvider } from 'src/core/modules'
import { FooterLandTypeContainer } from '../../components/land-type/footer-create-land-type-container'
import { CreateLandTypeContent } from './create-land-type-content'

export const CreateLandTypeContainer = () => {
    return (
        <CreateLandTypeContextProvider>
            <CreateLandTypeContent />
            <FooterLandTypeContainer />
        </CreateLandTypeContextProvider>
    )
}
