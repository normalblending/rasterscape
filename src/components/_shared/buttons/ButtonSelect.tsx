import * as React from "react";
import {Button, ButtonEventData, ButtonProps} from "./Button";
import * as classNames from "classnames";

export interface ButtonSelectEventData extends ButtonEventData {
    selected?: boolean
}

export interface ButtonSelectProps extends ButtonProps {
    selected?: boolean

    onClick?(data?: ButtonSelectEventData)

    onMouseDown?(data?: ButtonSelectEventData)
    onMouseUp?(data?: ButtonSelectEventData)
}

export const ButtonSelect: React.FC<ButtonSelectProps> = ({className, selected, onClick, onMouseDown, onMouseUp, ...props}) => {

    return (
        <Button
            {...props}
            onClick={data => onClick && onClick({...data, selected})}
            onMouseDown={data => onMouseDown && onMouseDown({...data, selected})}
            onMouseUp={data => onMouseUp && onMouseUp({...data, selected})}
            className={classNames("button-select", className, {["button-select-selected"]: selected})}/>
    );
};