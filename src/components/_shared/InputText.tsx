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

    maxLength?: number

    [other: string]: any
}

export const InputText: React.FC<InputTextProps> = ({maxLength, disabled, onChange, onFocus, onBlur, value, placeholder, className, ...otherProps}) => {

    const changeHandler = e => {
        onChange && onChange(e.target.value)
    };

    return (
        <input
            className={classNames(className, "input-text")}
            type="text"
            maxLength={maxLength}
            disabled={disabled}
            value={value || ''}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            onChange={changeHandler}
            {...otherProps}/>
    );
};