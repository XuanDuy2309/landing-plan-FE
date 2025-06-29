export const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 animate-[backdropAnimation_10s_ease-in-out_infinite] w-[200%] h-[200%] rounded-full absolute top-[-50%] left-[-50%]"></div>
        {/* Thêm các layer khác nếu gốc có */}
    </div>
);
