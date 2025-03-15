// Chỉ sử dụng TypeScript để kiểm tra kiểu
import classNames from "classnames";
import IcomoonReact from "icomoon-react";
import { memo, useMemo } from "react";
import { Colors } from "src/assets";
import iconSet from "src/assets/icons/selection.json";

interface IProps {
  className?: string;
  color?: string;
  icon: string;
  size?: string | number;
}

const IconBase: React.FC<IProps> = memo(({
  className = "",
  color = Colors.black,
  size = 24,
  icon
}: IProps) => {
  const renderedIcon = useMemo(() => (
    <IcomoonReact
      className={classNames("flex-none", className)}
      iconSet={iconSet}
      color={color === "transparent" ? undefined : color}
      size={size}
      icon={icon}
    />
  ), [className, color, size, icon]);

  return renderedIcon;
});

export { IconBase };
