import * as React from "react";
import * as classNames from "classnames";
import '../../../styles/inputText.scss';

export interface InputTextProps {
    onChange?(value: string): void

    onFocus?(e?)

    onBlur?(e?)

    className?: string
    placeholder?: string

    value: string

    disabled?: boolean

    maxLength?: number

    [other: string]: any
}

export interface CInputTextImperativeHandlers {
    blur()
}

export const InputText = React.forwardRef<CInputTextImperativeHandlers, InputTextProps>((props, ref) => {

    const {
        maxLength,
        disabled,
        onChange,
        onFocus,
        onBlur,
        value,
        placeholder,
        className,
        ...otherProps
    } = props;

    const changeHandler = e => {
        onChange && onChange(e.target.value)
    };

    const inputRef = React.useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
        blur: () => {
            console.log('blur');
            inputRef?.current?.blur();
        }
    }), [inputRef]);

    return (
        <input
            ref={inputRef}
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
});