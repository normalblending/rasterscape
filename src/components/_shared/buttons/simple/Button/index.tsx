import * as React from "react";
import classNames from "classnames";
import "./styles.scss";

export interface ButtonEventData {
    value: any,
    name?: string,
    e?: any,
}

export interface ButtonProps {
    onClick?(data?: ButtonEventData)
    onDoubleClick?(data?: ButtonEventData)
    onMouseEnter?(data?: ButtonEventData)
    onMouseLeave?(data?: ButtonEventData)

    onMouseDown?(data?: ButtonEventData)

    onMouseUp?(data?: ButtonEventData)

    value?: any
    name?: string

    className?: string
    children?: React.ReactNode,
    disabled?: boolean
    width?: number
    height?: number

    pressed?: boolean

    ref?: React.RefObject<any>

    [prop: string]: any
}

export const Button: React.FC<ButtonProps> = (props) => {

    const {
        ref,
        children,
        height,
        onClick,
        onDoubleClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
        disabled,
        width,
        className,
        value,
        name,
        pressed,
        ...otherProps
    } = props;

    const handleClick = React.useCallback(
        e => !disabled && onClick && onClick({e, value, name}),
        [disabled, onClick, value, name]);

    const handleDoubleClick = React.useCallback(
        e => !disabled && onDoubleClick && onDoubleClick({e, value, name}),
        [disabled, onDoubleClick, value, name]);

    const handleMouseEnter = React.useCallback(
        e => !disabled && onMouseEnter && onMouseEnter({e, value, name}),
        [disabled, onMouseEnter, value, name]);

    const handleMouseLeave = React.useCallback(
        e => !disabled && onMouseLeave && onMouseLeave({e, value, name}),
        [disabled, onMouseLeave, value, name]);

    const handleUp = React.useCallback(
        e => !disabled && onMouseUp && onMouseUp({e, value, name}),
        [disabled, onMouseUp, value, name]);

    const handleDown = React.useCallback(
        e => !disabled && onMouseDown && onMouseDown({e, value, name}),
        [disabled, onMouseDown, value, name]);

    const style = React.useMemo(() => ({width, height}), [width, height]);

    return (
        <button
            ref={ref}
            className={classNames("button", className, {
                ["button-pressed"]: pressed,
            })}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleUp}
            onMouseDown={handleDown}
            style={style}
            disabled={disabled}
            {...otherProps}
        >
            {children}
        </button>
    );
};
