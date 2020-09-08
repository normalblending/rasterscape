import * as React from "react";
import {Button, ButtonEventData, ButtonProps} from "../Button";
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

export class ButtonSelect extends React.PureComponent<ButtonSelectProps> {
    render() {
        const {
            className,
            selected,
            onClick,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
            ...props
        } = this.props;

        return (
            <Button
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
    }
}