import * as React from "react";
import * as classNames from "classnames";
import "../../styles/button.scss";

export interface ButtonEventData {
    value?: any,
    name?: string,
    e?: any
}

export interface ButtonProps {
    onClick?(data?: ButtonEventData)

    onMouseDown?(data?: ButtonEventData)

    value?: any
    name?: string

    className?: string
    children?: React.ReactNode,
    disabled?: boolean
    width?: number
}

export const Button: React.FC<ButtonProps> = ({children, onClick, onMouseDown, disabled, width, className, value, name}) => {
    return (
        <button
            className={classNames("button", className)}
            onClick={e => onClick && onClick({e, value, name})}
            onMouseDown={e => onMouseDown && onMouseDown({e, value, name})}
            style={{width}}
            disabled={disabled}>
            {children}
        </button>
    )
};