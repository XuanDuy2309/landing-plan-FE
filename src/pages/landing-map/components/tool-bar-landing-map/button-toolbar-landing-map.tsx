import { Tooltip } from "antd";
import classNames from "classnames";
import { Colors } from "src/assets";
import { IconBase } from "src/components";

interface IProps {
    onClick: () => void;
    icon: string;
    title: string;
    active?: boolean;
    className?: string;
}

export const ToolbarButton = ({ onClick, icon, title, active, className }: IProps) => (
    <Tooltip
        overlayInnerStyle={{
            backgroundColor: '#ffffff', // Màu nền của tooltip
            color: '#1f2937', // Màu chữ (màu gray-900)
            borderRadius: '4px', // Bo góc của tooltip
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Bóng đổ
            padding: '6px 10px', // Padding cho tooltip để dễ đọc hơn
        }}
        arrow={false}
        title={title} placement="left">
        <button
            onClick={onClick}
            className={classNames(
                'size-10 bg-white rounded-full active:border border-gray-500',
                className,
                { "text-blue-400": active, "text-gray-900": !active }
            )}
        >
            <IconBase icon={icon} size={20} color={"currentColor"} />
        </button>
    </Tooltip>
);
