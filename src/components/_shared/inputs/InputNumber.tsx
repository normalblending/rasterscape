import * as React from "react";
import * as classnames from 'classnames'

export interface InputNumberProps {
    onChange(value: number): void

    min?: number
    max?: number
    step?: number
    value?: number
    delay?: number
    notZero?: boolean

    className?: string
}


export const InputNumber: React.FC<InputNumberProps> = (props) => {

    const {
        className, value, onChange,
        min = 0, max = 1, step = 0.05,
    } = props;

    const [_value, set_value] = React.useState(value);
    const [__value, set__value] = React.useState(value);

    React.useEffect(() => {
        if (value !== __value) {
            set_value(value)
            set__value(value)
        }
    }, [__value, value]);

    const changeHandler = React.useCallback(e => {
        const n_value = +e.target.value;

        set_value(n_value);
    }, []);

    const blurHandler = React.useCallback(() => {
        onChange?.(_value);
    }, [onChange, _value]);

    const keyPressHandler = React.useCallback((e) => {
        if(e.key === 'Enter'){
            onChange?.(_value);
        }
    }, [onChange, _value]);

    return (
        <input
            className={classnames("input-number", className)}
            type="number"
            step={step}
            min={min}
            max={max}
            value={_value}
            onBlur={blurHandler}
            onChange={changeHandler}
            onKeyPress={keyPressHandler}
        />
    );
};