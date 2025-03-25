import classNames from 'classnames';
import { observer } from "mobx-react";
import { useRef } from "react";
import { IconBase } from "./icon-base";

const ButtonTemplates = {
    ActionBase: {
        color: 'bg-white',
        hoverColor: 'hover:bg-gray-50',
        active: 'active:bg-gray-200 active:border-gray-300 active:border',
    },
    ActionBaseMedium: {
        color: 'bg-white',
        hoverColor: 'hover:bg-gray-200',
        active: 'active:bg-gray-200 active:border-gray-300 active:border',
    },
}

interface IProps {
    template?: 'ActionBase' | "ActionBaseMedium";
    icon: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
    className?: string;
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    children?: React.ReactNode;
    size?: 'xxs' | 'xs' | "small" | "medium",
    border?: boolean;
    color?: string;
    iconSize?: string;
}

export const ButtonIcon = observer((props: IProps) => {
    const loadingRef = useRef<boolean>(false)
    let hoverColor = "";
    let active = "";
    let template = props.template || "ActionBase";
    let size = props.size || 'medium'
    if (template) {
        hoverColor = ButtonTemplates[template].hoverColor;
        active = ButtonTemplates[template].active;
    }

    let sizeButton = ' h-12 w-12';
    if (size === "xxs") {
        sizeButton = ' h-7 w-7 ';
    }
    if (size === "xs") {
        sizeButton = ' h-8 w-8 ';
    }
    if (size === "small") {
        sizeButton = ' h-10 w-10 ';
    }
    if (size === "medium") {
        sizeButton = ' h-11 w-11 ';
    }

    let mainClass = classNames(
        ' flex flex-none flex-row items-center justify-center rounded ' + props.className + sizeButton,
        {
            ' bg-gray-50 text-gray-300 ': props.disabled,
        },
        {
            "border": props.border
        }
    )
    if (props.disabled) {
        hoverColor = "bg-transparent hover:bg-transparent";
        active = "active:bg-transparent";
        mainClass += ` ${hoverColor} ${active} `;
    }


    if (!props.disabled)
        mainClass += ` ${hoverColor} ${active} `;

    const onClick = async (e) => {
        if (loadingRef.current) return;
        if (props.onClick) {
            try {
                loadingRef.current = true;
                setTimeout(() => {
                    loadingRef.current = false;
                }, 5000)
                await props.onClick(e);
                loadingRef.current = false;
            } catch (e) {
                loadingRef.current = false;
            }
        }
    }

    return (
        <button disabled={props.disabled}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
                onClick && onClick(e);
                e.preventDefault();
            }}
            className={mainClass + " hover:bg-gray-200  rounded-full "}
            aria-label="icon"
        >

            {props.icon && <IconBase icon={props.icon} size={props.iconSize || "16px"} color={props.color} />}
        </button>
    )
})

