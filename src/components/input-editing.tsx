import classNames from "classnames";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IconBase } from "./icon-base";


interface IProps {
    className?: string | undefined;
    type?: "text" | "number"
    onChange?: (value?: string) => void;
    placeholder?: string;
    value?: string;
    autoFocus?: boolean;
    onBlur?: (value?: string) => void;
    isLink?: boolean;
    disabled?: boolean
    maxLength?: number;
    active?: boolean
}

export const InputEditing = forwardRef(({ active, maxLength, isLink, autoFocus, placeholder, onBlur, className, value, onChange, disabled, type = "text" }: IProps, ref) => {
    const [str, setStr] = useState<string>();
    const [isActive, setActive] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const onBlurChange = (e) => {
        if (onChange)
            onChange(e.target.value)
        if (onBlur)
            onBlur(e.target.value)
        if (!active) {
            if (e.target.value != '') setActive(false)
            if (e.target.value == '') setActive(true)
        }
    }


    const onChangeText = (value) => {
        if (type == "number") {
            if (isNaN(value)) {
                value = ""
            }
        }
        onChange && onChange(value)
        setStr(value)
        setActive(true)
    }

    const clearInput = () => {
        setStr('')
        if (onChange)
            onChange("")
    }

    useImperativeHandle(ref, () => ({
        clearInput
    }))

    useEffect(() => {
        if (autoFocus) {
            setActive(true)
            setTimeout(() => {
                inputRef.current?.focus();
            })
        }
    }, [autoFocus])

    useEffect(() => {
        if (active) {
            setActive(true)
        }
    }, [active])

    useEffect(() => {
        // console.log('value',value)
        if (value) setStr(value)
        else setStr('')
    }, [value])

    if (isActive || !str || (maxLength && str.length > maxLength))
        return (
            <div className={`group w-full flex flex-row border-b-[1px] border-gray-100`}>
                <input
                    ref={inputRef}
                    value={str || ""}
                    placeholder={placeholder}
                    onBlur={onBlurChange}
                    onChange={(e) => {
                        onChangeText(e.target.value)
                        e.stopPropagation()
                    }}
                    autoComplete="off"
                    className={`focus:outline-none bg-transparent focus:ring-2 
                    focus:ring-transparent 
                    w-full  hover:none ` + className}
                    disabled={disabled}
                />
                {!!maxLength && (
                    <span className={classNames('bg-baseGray-40 min-w-10 rounded-md ml-4 text-xs flex items-center justify-center text-black p-1',
                        {
                            "text-red-400 bg-red-100": str && str.length > maxLength
                        })}>
                        {str?.length || 0}/{maxLength}
                    </span>
                )}
            </div>
        )
    else {
        return (
            <div className={`group2 flex flex-row items-center space-x-2 text-left text-md`}>
                {isLink ?
                    <a href={str} target="_blank" rel="noreferrer">
                        <span className={" " + className} >{str}</span>
                    </a>
                    :
                    <span className={" " + className} >{str}</span>
                }
                {!disabled &&
                    <div>
                        <button
                            onClick={() => {
                                setActive(true)
                                setTimeout(() => {
                                    inputRef.current?.focus()
                                }, 200)
                            }}
                            className='group2-hover:visible group2-hover:text-baseGray-60 
                    group2-focus-within:visible visible text:gray-900
                  hover:text-green-400 flex items-center justify-center'
                        >
                            <IconBase icon='edit-outline' color="currentColor" size={"16px"} />
                        </button>
                    </div>
                }
            </div >
        )
    }
})