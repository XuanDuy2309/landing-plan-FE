import { useCoreStores } from "../../../core/stores";
import { FormLogin } from "../containers/form-login";

export const LoginScreen = () => {
    const { sessionStore } = useCoreStores();
    return <div 
    className="w-full h-full flex justify-center pt-12 bg-[url('src/assets/images/bg-auth.png')] bg-contain bg-left-top bg-no-repeat bg-gray-100">
        <FormLogin />
    </div>;
};