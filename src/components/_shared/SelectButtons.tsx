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

export const SelectButtons: React.FC<SelectButtonsLineProps> = ({items, value, name, onChange, getValue = defaultGetValue, getText = defaultGetText}) => {

    const handleClick = ({value: item, e}) =>
        onChange({
            value: getValue(item),
            e, item, items, name
        });

    return (
        <span className={"select-buttons"}>
            {items.map((item) => (
                <ButtonSelect
                    value={item}
                    key={getValue(item)}
                    selected={getValue(item) === value}
                    onClick={handleClick}>
                    {getText(item)}
                </ButtonSelect>
            ))}
        </span>
    );
};