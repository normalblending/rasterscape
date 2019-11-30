import * as React from "react";
import * as classNames from "classnames";
import {ButtonSelect} from "./ButtonSelect";
import {ButtonEventData} from "./Button";

export interface SelectButtonsEventData extends ButtonEventData {
    item: any
    items: any[]
}

export interface SelectButtonsProps {
    className?: string
    name?: string
    items: any[]
    value?: any

    onChange?(data?: SelectButtonsEventData)

    getValue?(item?: any)

    getText?(item?: any)
}

export const defaultGetValue = ({value}) => value;
export const defaultGetText = ({text}) => text;

export class SelectButtons extends React.PureComponent<SelectButtonsProps> {


    handleClick = ({value: item, e}) => {
        const {name, items, onChange, getValue = defaultGetValue} = this.props;
        onChange && onChange({
            value: getValue(item),
            e, item, items, name
        });
    };

    render() {
        const {className, items, value, name, getValue = defaultGetValue, getText = defaultGetText} = this.props;

        console.log("select buttons render", name);

        return (
            <span className={classNames(className, "select-buttons")}>
            {items.map((item) => (
                <ButtonSelect
                    value={item}
                    key={getValue(item)}
                    selected={getValue(item) === value}
                    onMouseUp={(e) => {
                        console.log(e)
                    }}
                    onClick={this.handleClick}>
                    {getText(item)}
                </ButtonSelect>
            ))}</span>
        );
    }
}