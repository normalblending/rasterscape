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
    onBlur?(data?: ButtonEventData)
    onFocus?(data?: ButtonEventData)

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

export interface ButtonImperativeHandlers {
    focus()
    blur()
    getElement(): HTMLButtonElement
}

export const Button: React.FC<ButtonProps> = React.forwardRef<ButtonImperativeHandlers, ButtonProps>((props, ref) => {

    const {
        children,
        height,
        onClick,
        onDoubleClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
        onBlur,
        onFocus,
        disabled,
        width,
        className,
        value,
        name,
        pressed,
        ...otherProps
    } = props;

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            buttonRef.current.focus();
        },
        blur: () => {
            buttonRef.current.blur();
        },
        getElement: () => {
            return buttonRef.current
        }
    }), [buttonRef])
    const handleClick = React.useCallback(
        e => {
            console.log(e, value, name);
            return !disabled && onClick && onClick({e, value, name})
        },
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

    const handleBlur = React.useCallback(
        e => !disabled && onBlur && onBlur({e, value, name}),
        [disabled, onBlur, value, name]);

    const handleFocus = React.useCallback(
        e => !disabled && onFocus && onFocus({e, value, name}),
        [disabled, onFocus, value, name]);

    const style = React.useMemo(() => ({width, height}), [width, height]);

    return (
        <button
            ref={buttonRef}
            className={classNames("button", className, {
                ["button-pressed"]: pressed,
            })}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleUp}
            onMouseDown={handleDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={style}
            disabled={disabled}
            {...otherProps}
        >
            {children}
        </button>
    );
});
