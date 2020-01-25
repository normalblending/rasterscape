import * as React from "react";
import * as classNames from "classnames";
import "../../styles/button.scss";
import {EventData} from "../../utils/types";

export interface ButtonEventData extends EventData {
}

export interface ButtonProps {
    onClick?(data?: ButtonEventData)

    onMouseDown?(data?: ButtonEventData)

    onMouseUp?(data?: ButtonEventData)

    value?: any
    name?: string

    className?: string
    children?: React.ReactNode,
    disabled?: boolean
    width?: number

    ref?: React.RefObject<any>
}

export const Button: React.FC<ButtonProps> = ({ref, children, onClick, onMouseDown, onMouseUp, disabled, width, className, value, name}) => {
    return (
        <button
            ref={ref}
            className={classNames("button", className)}
            onClick={e => onClick && onClick({e, value, name})}
            onMouseUp={e => onMouseUp && onMouseUp({e, value, name})}
            onMouseDown={e => onMouseDown && onMouseDown({e, value, name})}
            style={{width}}
            disabled={disabled}>
            {children}
        </button>
    )
};