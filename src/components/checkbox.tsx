import classNames from 'classnames';
import { memo } from 'react';
import { IconBase } from './icon-base';
import { Colors } from 'src/assets';
interface IProps {
    label?: string | React.ReactNode;
    className?: string;
    checked?: boolean;
    onChange?: (value, e: Event) => void;
    primary?: boolean;
    disabled?: boolean;
    size?: "xs" | "md" | "medium"
}
export const CheckBox = memo((props: IProps) => {
    const onSelect = (value, e) => {
        props.onChange && props.onChange(value, e);
    };
    let sizeClass = "w-10 h-10";
    let iconSize = "20px";
    if (props.size === "xs") { 
        sizeClass = "w-7 h-7";
        iconSize = "14px";
    }
    if (props.size === "md") {
        sizeClass = "w-7 h-7";
        iconSize = "16px";
    }
    return (
        <button
            disabled={props.disabled}
            onClick={(e) => onSelect(!props.checked, e)}
            className={' flex-none  flex flex-row text-md items-center group space-x-1 ' + props.className}
        >
            <div className={classNames('flex flex-none justify-center items-center rounded-full ' + sizeClass,
                { "hover:bg-gray-200 active:bg-gray-200 group-hover:bg-gray-200 group-active:border group-active:border-gray-300  active:border active:border-gray-300": !props.disabled }
            )}>
                {props.checked ? (
                    <IconBase
                        icon='checkbox-outline'
                        size={iconSize}
                        color={props.primary ? Colors.blue[600] : Colors.gray[800]}
                    />
                ) : (
                    <IconBase icon='square' size={iconSize} color={Colors.gray[500]} />
                )}
            </div>
            {props.label && <span className='text-md text-gray-900'>{props.label}</span>}
        </button>
    );
});
