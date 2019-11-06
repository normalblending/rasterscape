import * as React from "react";
import * as classNames from "classnames";

export const ValueD = {
    VerticalLinear: (step: number) => (oldValue: any, dx: number, dy) => oldValue - dy / step,
};

export interface ButtonBooleanProps {
    name?: string
    text?: string
    className?: string
    classNameSelected?: string
    selected?: boolean
    width?: number

    onClick?(value: any, name?: string)

}

export interface ButtonBooleanState {
}

export class ButtonBoolean extends React.PureComponent<ButtonBooleanProps, ButtonBooleanState> {

    handleClick = () => {
        const {onClick, selected, name} = this.props;

        onClick && onClick(!selected, name);
    };

    render() {
        const {className, classNameSelected, selected} = this.props;
        console.log("boolean button render");
        return (
            <div
                className={classNames(
                    "value-button", "boolean-button", className,
                    {["value-button-selected"]: selected, [classNameSelected]: selected})}
                onMouseDown={this.handleClick}>
                <div
                    className={"value-button-value"}>
                    {"-"}
                </div>
            </div>
        );
    }
}