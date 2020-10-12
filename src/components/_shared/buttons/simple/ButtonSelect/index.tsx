import * as React from "react";
import {Button, ButtonEventData, ButtonImperativeHandlers, ButtonProps} from "../Button";
import * as classNames from "classnames";
import './styles.scss';

export interface ButtonSelectEventData extends ButtonEventData {
    selected?: boolean
}

export interface ButtonSelectProps extends ButtonProps {
    selected?: boolean

    onClick?(data?: ButtonSelectEventData)

    onMouseDown?(data?: ButtonSelectEventData)

    onMouseUp?(data?: ButtonSelectEventData)

    onMouseEnter?(data?: ButtonSelectEventData)

    onMouseLeave?(data?: ButtonSelectEventData)
}

export interface ButtonSelectimperativeHandlers extends ButtonImperativeHandlers {

}

export const ButtonSelect = React.forwardRef<ButtonSelectimperativeHandlers, ButtonSelectProps>((_props, ref) => {

    const {
        className,
        selected,
        onClick,
        onMouseDown,
        onMouseUp,
        onMouseEnter,
        onMouseLeave,
        ...props
    } = _props;

    const buttonRef = React.useRef<ButtonImperativeHandlers>(null);

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            buttonRef.current.focus();
        },
        blur: () => {
            buttonRef.current.blur();
        },
        getElement: () => {
            return buttonRef.current.getElement();
        }
    }), [])

    return (
        <Button
            ref={buttonRef}
            {...props}
            onClick={data => onClick && onClick({...data, selected})}
            onMouseDown={data => onMouseDown && onMouseDown({...data, selected})}
            onMouseUp={data => onMouseUp && onMouseUp({...data, selected})}
            onMouseEnter={data => onMouseEnter && onMouseEnter({...data, selected})}
            onMouseLeave={data => onMouseLeave && onMouseLeave({...data, selected})}
            className={classNames("button-select", className, {
                ["button-select-selected"]: selected,
            })}/>
    );

});