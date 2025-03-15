// import { Spin } from 'antd';
import classNames from 'classnames';
import { observer } from "mobx-react";
import { useState } from "react";
import { IconBase } from "./icon-base";
import { Colors } from 'src/assets';
import { Spin } from 'antd';

const ButtonTemplates = {
    ActionBase: {
        baseColor: Colors.black,
        baseClassName: "bg-white hover:bg-gray-50 focus:bg-white focus:border-blue-300 focus:border",
    },
    ActionBaseBorder: {
        baseColor: Colors.black,
        baseClassName: "bg-white hover:bg-gray-50 focus:bg-white focus:border-blue-300 focus:border border",
    },
    ActionBlue: {
        baseColor: Colors.blue[800],
        baseClassName: "bg-blue-600 hover:bg-blue-400 border text-white",
    },
    ActionGreen: {
        baseColor: Colors.green[700],
        baseClassName: "bg-green-500 hover:bg-green-400 border text-white",
    },
    ActionBlueOutline: {
        baseColor: Colors.blue[800],
        baseClassName: "bg-white border-blue-400 hover:bg-blue-600 border text-blue-600 hover:text-white ",
    },
    ActionBlueNoBorder: {
        baseColor: Colors.blue[800],
        baseClassName: "bg-white border-white border-none hover:bg-blue-600 border text-blue-600 hover:text-white ",
    },
    ActionOrange: {
        baseColor: Colors.orange[600],
        baseClassName: "bg-orange-400 hover:bg-orange-400 border text-white ",
    },
    ActionOrangeOutline: {
        baseColor: Colors.orange[600],
        baseClassName: "bg-white border-orange-400 hover:bg-orange-400 border text-orange-400 hover:text-white ",
    },
    ActionBgNone: {
        baseColor: Colors.black,
        baseClassName: "",
    },
    ActionGreenOutline: {
        baseColor: Colors.green[700],
        baseClassName: "bg-white border-green-500 hover:bg-green-500 border text-green-500 hover:text-white ",
    },
    ActionGray: {
        baseColor: Colors.gray[500],
        baseClassName: "bg-gray-300 hover:bg-gray-200 border text-white ",
    },
}

interface IProps {
    template?: 'ActionBase' | "ActionBaseBorder" | 'ActionBlue' | "ActionBlueOutline" | "ActionOrange" | "ActionOrangeOutline" | "ActionBgNone" | "ActionGreenOutline" | "ActionGreen" | "ActionBlueNoBorder" | "ActionGray";
    iconLeft?: string;
    iconRight?: string;
    onClick?: (e) => void;
    className?: string;
    type?: 'submit' | 'reset' | 'button';
    label?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    haveLoading?: boolean;
    size?: 'xxs' | 'xs' | "small" | "medium",
    loading?: boolean;
}

export const ButtonLoading = observer((props: IProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [haveLoading] = useState<boolean>(props.haveLoading !== undefined ? props.haveLoading : true)
    let template = props.template || "ActionBase";
    let size = props.size || 'medium';
    let baseClassName = "";
    let baseColor = "";
    if (template) {
        baseClassName = ButtonTemplates[template].baseClassName;
        baseColor = ButtonTemplates[template].baseColor;
    }

    let sizeButton = ' h-12 ';
    if (size === "xxs") {
        sizeButton = ' h-7 px-[10px] ';
    }
    if (size === "xs") {
        sizeButton = ' h-8 px-3 ';
    }
    if (size === "small") {
        sizeButton = ' h-9 px-[12px] ';
    }
    if (size === "medium") {
        sizeButton = ' h-11 px-4 ';
    }

    if ((props.iconLeft || props.iconRight) && size === "medium" && props.label) {
        sizeButton = " h-11 px-3"
    }

    let mainClass = classNames(
        ' group flex flex-row items-center rounded space-x-2 ' + props.className + sizeButton,
    )
    if (!props.disabled)
        mainClass += ` ${baseClassName}`;
    if (props.disabled) {
        mainClass += ` border border-gray-100 bg-white text-gray-400 `;
    }

    const onClick = async (e) => {
        if (props.onClick) {
            try {
                if (haveLoading) {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 15000)
                }

                await props.onClick(e);
                if (haveLoading) {
                    setLoading(false);
                }

            } catch (e) {
                if (haveLoading) setLoading(false);
            }
        }
    }

    return (
        <button type="submit" disabled={props.disabled || props.loading}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                onClick && onClick(e);
            }}
            className={mainClass}
        >
            {props.iconLeft &&
                <IconBase icon={props.iconLeft} size={"16px"}
                    color="currentColor"
                />
            }
            {props.children ? props.children : !props.loading ? <span className="text-md font-medium">{props.label}</span> : <><Spin /></>}
            {props.iconRight && <IconBase icon={props.iconRight} size={"16px"}
                color="currentColor"
            />
            }
        </button>
    )
})

