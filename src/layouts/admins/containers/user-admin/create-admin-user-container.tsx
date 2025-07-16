import { CreateAdminUserContextProvider } from 'src/core/modules'
import { CreateAdminUserContent } from './create-admin-user-content'
import { FooterCreateAdminUser } from './footer-create-admin-user'

export const CreateAdminUserContainer = () => {
    return (
        <CreateAdminUserContextProvider>
            <CreateAdminUserContent />
            <FooterCreateAdminUser />
        </CreateAdminUserContextProvider>
    )
}
