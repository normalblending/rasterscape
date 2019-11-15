import * as React from "react";
import {ButtonSelect} from "./ButtonSelect";
import {ButtonEventData} from "./Button";

export interface SelectButtonsEventData extends ButtonEventData {
    item: any
    items: any[]
}

export interface SelectButtonsLineProps {
    name?: string
    items: any[]
    value?: any

    onChange?(data?: SelectButtonsEventData)

    getValue?(item?: any)

    getText?(item?: any)
}

const defaultGetValue = ({value}) => value;
const defaultGetText = ({text}) => text;

export class SelectButtons extends React.PureComponent<SelectButtonsLineProps> {


    handleClick = ({value: item, e}) => {
        const {name, items, onChange, getValue = defaultGetValue} = this.props;
        onChange && onChange ({
            value: getValue(item),
            e, item, items, name
        });
    };

    render () {
        const {items, value, name, getValue = defaultGetValue, getText = defaultGetText} = this.props;

        console.log("select buttons render", name);

        return (
            <span className={"select-buttons"}>
            {items.map((item) => (
                <ButtonSelect
                    value={item}
                    key={getValue(item)}
                    selected={getValue(item) === value}
                    onClick={this.handleClick}>
                    {getText(item)}
                </ButtonSelect>
            ))}
        </span>
        );
    }
};