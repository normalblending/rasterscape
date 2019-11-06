import * as React from "react";

export interface CheckboxProps {
    onChange(value: boolean): void

    value: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({value, onChange}) => {

    const changeHandler = e => {
        onChange(e.target.checked);
    };

    return (
        <input
            type="checkbox"
            checked={value}
            onChange={changeHandler}/>
    );
};