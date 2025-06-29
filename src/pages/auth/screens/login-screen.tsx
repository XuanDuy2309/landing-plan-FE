import { useCoreStores } from "../../../core/stores";
import LoginForm from "../containers/login-container";

export const LoginScreen = () => {
    const { sessionStore } = useCoreStores();
    return <div
        className="w-full h-full flex justify-center items-center  bg-contain bg-left-top bg-no-repeat bg-gray-100">
        <LoginForm />
    </div>;
};
