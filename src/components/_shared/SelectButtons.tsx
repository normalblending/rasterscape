import * as React from "react";
import {ButtonSelect} from "./ButtonSelect";

export interface SelectButtonsLineProps {
    name?: string
    items: any[]
    value?: any

    onChange?(value: any, name?: string, item?: any)

    getValue?(item?: any)

    getText?(item?: any)
}

const defaultGetValue = (item: any) => item;
const defaultGetText = (item: any) => item;

export const SelectButtons: React.FC<SelectButtonsLineProps> = ({items, value, name, onChange, getValue = defaultGetValue, getText = defaultGetText}) => {
    return (
        <span className={"select-buttons"}>
            {items.map((item) => (
                <ButtonSelect
                    key={getValue(item)}
                    selected={getValue(item) === value}
                    onClick={() => onChange(getValue(item), name, item)}>
                    {getText(item)}
                </ButtonSelect>
            ))}
        </span>
    );
};