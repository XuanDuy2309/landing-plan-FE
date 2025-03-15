import { Link } from "react-router-dom";
import { ButtonLoading } from "../../../components/Button";

export const LandingMapScreen = () => {
    return <div className="w-full h-screen flex items-center justify-center bg-blue-100 space-x-2">
        <Link to='/auth/login'>
            <ButtonLoading>Log in</ButtonLoading>
        </Link>
    </div>
};