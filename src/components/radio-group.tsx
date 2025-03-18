import classNames from 'classnames';
import React from 'react';
import { IconBase } from './icon-base';
import { Colors } from 'src/assets';
interface RadioGroupValue {
    value: string | number;
    label: string | React.ReactNode;
    icon?: string;
    iconColor?: string;
    img?: string;
    children?: React.ReactNode;
}
interface IProps {
    data: RadioGroupValue[];
    value?: string | number;
    className?: string;
    onChange?: (value) => void;
    onClick?: () => void;
    vertical?: boolean;
    primary?: boolean;
    disabled?: boolean;
    size?: "xs" | "medium";
    renderValue?: (value) => React.ReactNode;
}
export const RadioGroup = (props: IProps) => {
    let iconSize = "12px";
    if (props.size === "medium") {
        iconSize = "16px";
    }
    const onChange = (value) => {
        // setSelected(value)
        props.onChange && props.onChange(value)
    }
    return (
        <div className={classNames(" group2 ",
            { "flex-col ": props.vertical },
            { "space-x-3 flex flex-wrap justify-start": !props.vertical },

        ) + " " + props.className}
        >
            {props.data.map((item, index) =>
                <div key={index} className='group'>
                    <button onClick={(e) => {
                        onChange(item.value)
                        props.onClick && props.onClick()
                        e.stopPropagation()
                    }}
                        disabled={props.disabled}
                        className="flex items-center space-x-1 justify-start" key={index}
                    >
                        <div className='w-7 h-7 flex flex-none justify-center items-center group-hover:bg-gray-200 group-active:border group-active:border-gray-300 hover:bg-gray-200 active:bg-gray-200 active:border-gray-300 active:border rounded-full'>
                            {props.value !== item.value ?
                                <IconBase icon={"round"}
                                    size={16} color={Colors.gray[800]}
                                />
                                :
                                <IconBase icon={"active"}
                                    size={16} color={props.primary ? Colors.blue[600] : Colors.gray[800]}
                                />
                            }
                        </div>

                        <div className='flex space-x-1 items-center'>
                            {item.icon &&
                                <IconBase icon={item.icon} color={item.iconColor} size={"14px"} />
                            }
                            {item.img &&
                                <img src={item.img} className="w-3 h-3" />
                            }
                            <span className={props.value === item.value ? "text-black text-md" : "text-gray-900 text-md"}>{props.renderValue ? props.renderValue(item.label) : item.label}</span>
                        </div>
                    </button>
                    {props.value === item.value && item.children &&
                        <div onClick={(e) => e.stopPropagation()}>
                            {item.children}
                        </div>
                    }
                </div>
            )}
        </div>
    )
}

