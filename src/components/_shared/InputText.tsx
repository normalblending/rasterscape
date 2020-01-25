import * as React from "react";
import * as classNames from "classnames";

export interface InputTextProps {
    onChange?(value: string): void

    onFocus?()
    onBlur?()

    className?: string

    value: string
}

export const InputText: React.FC<InputTextProps> = ({onChange, onFocus, onBlur, value, className}) => {

    const changeHandler = e => {
        onChange && onChange(e.target.value)
    };

    return (
        <input
            className={classNames(className, "input-text")}
            type="text"
            value={value || ''}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={changeHandler}/>
    );
};