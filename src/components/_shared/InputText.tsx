import * as React from "react";
import * as classNames from "classnames";
import '../../styles/inputText.scss';


export interface InputTextProps {
    onChange?(value: string): void

    onFocus?()
    onBlur?()

    className?: string
    placeholder?: string

    value: string

    disabled?: boolean
}

export const InputText: React.FC<InputTextProps> = ({disabled, onChange, onFocus, onBlur, value, placeholder, className}) => {

    const changeHandler = e => {
        onChange && onChange(e.target.value)
    };

    return (
        <input
            className={classNames(className, "input-text")}
            type="text"
            disabled={disabled}
            value={value || ''}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            onChange={changeHandler}/>
    );
};