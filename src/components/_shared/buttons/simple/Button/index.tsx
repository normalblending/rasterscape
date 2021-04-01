import * as React from "react";
import classNames from "classnames";
import "./styles.scss";

export interface ButtonEventData {
    value: any,
    name?: string,
    e?: any,
    data?: any,
}

export interface ButtonProps {
    onClick?(data?: ButtonEventData)

    onDoubleClick?(data?: ButtonEventData)

    onMouseEnter?(data?: ButtonEventData)

    onMouseLeave?(data?: ButtonEventData)

    onMouseDown?(data?: ButtonEventData)

    onMouseUp?(data?: ButtonEventData)

    onMouseMove?(data?: ButtonEventData)

    onBlur?(data?: ButtonEventData)

    onFocus?(data?: ButtonEventData)

    value?: any
    name?: string
    data?: any

    className?: string
    children?: React.ReactNode,
    disabled?: boolean
    width?: number
    height?: number
    autofocus?: boolean
    autoblur?: boolean

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
        onMouseMove,
        onBlur,
        onFocus,
        disabled,
        width,
        className,
        value,
        name,
        data,
        pressed,
        autofocus,
        autoblur,
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
    }), [buttonRef]);

    const getButtonEventData = React.useCallback((e): ButtonEventData => {
        return {
            value, name, data, e
        }
    }, [value, name, data]);

    const handleClick = React.useCallback(
        e => {
            if (disabled) return;

            onClick && onClick(getButtonEventData(e))

            buttonRef.current.focus();
        },
        [disabled, onClick, getButtonEventData, buttonRef]);

    const handleDoubleClick = React.useCallback(
        e => !disabled && onDoubleClick && onDoubleClick(getButtonEventData(e)),
        [disabled, onDoubleClick, getButtonEventData]);

    const handleMouseEnter = React.useCallback(e => {
        if (disabled) return;

        if (autofocus)
            buttonRef.current?.focus();

        onMouseEnter?.(getButtonEventData(e));

    }, [disabled, onMouseEnter, getButtonEventData, autofocus]);

    const handleMove = React.useCallback(e => {
        if (disabled) return;

        if (autofocus && document.activeElement !== buttonRef.current)
            buttonRef.current?.focus();

        onMouseMove?.(getButtonEventData(e));

    }, [disabled, onMouseMove, getButtonEventData, autofocus]);

    const handleMouseLeave = React.useCallback(e => {
        if (disabled) return;

        if (autoblur)
            buttonRef.current?.blur();

        onMouseLeave?.(getButtonEventData(e));

    }, [disabled, onMouseLeave, getButtonEventData, autoblur]);

    const handleUp = React.useCallback(
        e => !disabled && onMouseUp?.(getButtonEventData(e)),
        [disabled, onMouseUp, getButtonEventData]);

    const handleDown = React.useCallback(
        e => !disabled && onMouseDown?.(getButtonEventData(e)),
        [disabled, onMouseDown, getButtonEventData]);

    const handleBlur = React.useCallback(
        e => !disabled && onBlur?.(getButtonEventData(e)),
        [disabled, onBlur, getButtonEventData]);

    const handleFocus = React.useCallback(
        e => !disabled && onFocus?.(getButtonEventData(e)),
        [disabled, onFocus, getButtonEventData]);

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
            onMouseMove={handleMove}
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
