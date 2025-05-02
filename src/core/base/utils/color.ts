export function getRandomColorAvatar() {
    const red = Math.floor(Math.random() * 128);
    const green = Math.floor(Math.random() * 128);
    const blue = Math.floor(Math.random() * 128);
    const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    return color;
}

export function getColorFromId(id: number) {
    // Chuyển ID thành một số nguyên
    const hash: any = Array.from(String(id)).reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Sử dụng số hash để tạo màu ngẫu nhiên tối hơn (giảm giá trị màu sáng để tương phản với trắng)
    const r = Math.floor((hash * 137) % 128); // Giới hạn giá trị từ 0-127 để tạo màu tối hơn
    const g = Math.floor((hash * 251) % 128);
    const b = Math.floor((hash * 199) % 128);

    // Tạo màu dạng RGB
    const color = `rgb(${r}, ${g}, ${b})`;

    return color;
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Hàm chuyển đổi HEX sang RGB
const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};

// Hàm tính độ sáng của màu
const getLuminance = ({ r, g, b }: { r: number, g: number, b: number }) => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};


// Hàm chuyển đổi UUID thành một màu ngẫu nhiên có độ tương phản cao với màu trắng
export const uuidToColor = (uuid: string) => {
    // Lấy 6 ký tự đầu tiên của UUID và chuyển chúng thành giá trị HEX
    const hex = uuid.replace(/-/g, '').slice(0, 6);

    // Chuyển đổi HEX thành RGB
    let colorRgb = hexToRgb(hex);
    let luminance = getLuminance(colorRgb);

    // Điều chỉnh màu để tăng độ tương phản nếu cần thiết
    while (luminance > 180) { // Giảm độ sáng nếu quá sáng
        colorRgb = {
            r: Math.max(0, colorRgb.r - 30),
            g: Math.max(0, colorRgb.g - 30),
            b: Math.max(0, colorRgb.b - 30),
        };
        luminance = getLuminance(colorRgb);
    }

    while (luminance < 50) { // Tăng độ sáng nếu quá tối
        colorRgb = {
            r: Math.min(255, colorRgb.r + 30),
            g: Math.min(255, colorRgb.g + 30),
            b: Math.min(255, colorRgb.b + 30),
        };
        luminance = getLuminance(colorRgb);
    }

    // Chuyển đổi lại thành mã HEX
    const color = `#${((1 << 24) + (colorRgb.r << 16) + (colorRgb.g << 8) + colorRgb.b).toString(16).slice(1)}`;

    return color;
};


export function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}