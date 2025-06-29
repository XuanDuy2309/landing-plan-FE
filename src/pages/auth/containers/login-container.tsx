import { useState } from 'react';
import { LoginForm2 } from './login-form-2';
import { RegisterForm2 } from './register-form-2';

const LoginForm = () => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className="relative overflow-hidden w-[768px] max-w-full min-h-[568px] h-[60%] bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] flex">
            {/* Form Đăng ký */}
            <RegisterForm2 isSignup={isSignup} />
            {/* Form Đăng nhập */}
            <LoginForm2 isSignup={isSignup} setIsSignup={setIsSignup} />

            {/* Bảng chuyển đổi */}
            <div
                className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-50 ${isSignup ? '-translate-x-full rounded-r-[150px]' : 'rounded-l-[150px]'}`}
            >
                <div
                    className={`bg-gradient-to-r from-indigo-500 to-purple-700 text-white w-[200%] h-full flex items-center justify-between transform transition-all duration-700 ease-in-out ${isSignup ? '-translate-x-1/2' : 'translate-x-0'}`}
                >
                    <div className="w-1/2 flex flex-col items-center justify-center px-8 text-center">
                        <h1 className="text-2xl font-bold">Xin chào, bạn mới!</h1>
                        <p className="text-sm">Đăng ký tài khoản để sử dụng tất cả tính năng của hệ thống</p>
                        <button
                            onClick={() => setIsSignup(true)}
                            className="mt-4 border border-white px-6 py-2 rounded text-xs uppercase"
                        >
                            Đăng ký
                        </button>
                    </div>
                    <div className="w-1/2 flex flex-col items-center justify-center px-8 text-center">
                        <h1 className="text-2xl font-bold">Chào mừng trở lại!</h1>
                        <p className="text-sm">Đăng nhập để tiếp tục sử dụng các tính năng</p>
                        <button
                            onClick={() => setIsSignup(false)}
                            className="mt-4 border border-white px-6 py-2 rounded text-xs uppercase"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
