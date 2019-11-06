import * as React from "react";
import {Button} from "./Button";

export interface SelectButtonsProps {
    name?: string
    items: any[]
    value?: any
    onChange?(value: any, name?: string, item?: any)
}

export const SelectButtons: React.FC<SelectButtonsProps> = ({items, value, name, onChange}) => {
    return (
        <>
            {items.map((item, i) => (
                <Button
                    className={item.value === value ? "selected-button" : ""}
                    key={i}
                    onClick={() => onChange(item.value, name, item)}>
                    {item.text}
                </Button>
            ))}
        </>
    );
};