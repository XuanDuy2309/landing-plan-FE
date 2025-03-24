import { useCoreStores } from "../stores"

export const showLoading = () => {  
    const {sessionStore} = useCoreStores();
    sessionStore.showLoading();
}

export const hideLoading = () => {
    const {sessionStore} = useCoreStores();
    sessionStore.hideLoading();
}