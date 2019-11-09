import * as React from "react";

export interface InputTextProps {
    onChange?(value: string): void

    value: string
}

export const InputText: React.FC<InputTextProps> = ({onChange, value}) => {

    const changeHandler = e => {
        onChange && onChange(e.target.value)
    };

    return (
        <input
            type="text"
            value={value}
            onChange={changeHandler}/>
    );
};