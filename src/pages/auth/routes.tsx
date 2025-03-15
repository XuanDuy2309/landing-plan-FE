import { Routes, Route } from "react-router-dom";
import { LoginScreen } from "./screens/login-screen";
import { RegisterScreen } from "./screens/register-screen";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
    </Routes>
  );
};
