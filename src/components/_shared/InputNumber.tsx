import * as React from "react";

export interface InputNumberProps {
    onChange(value: number): void

    min?: number
    max?: number
    step?: number
    value?: number
    delay?: number
    notZero?: boolean
}

let timer;

export const InputNumber: React.FC<InputNumberProps> = ({value, onChange, min = 0, max = 1, step = 0.05, delay, notZero}) => {

    const [_value, set_value] = React.useState(value);

    const changeHandler = e => {
        const n_value = +e.target.value;

        if (!delay) {

            if (notZero && !n_value) {
                return;
            }

            set_value(n_value);
            onChange(n_value)

        } else {

            set_value(n_value);

            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                if (notZero && !n_value) {
                    set_value(value);
                    return;
                }

                onChange(n_value);

            }, delay)
        }
    };

    return (
        <input
            type="number"
            step={step}
            min={min}
            max={max}
            value={_value}
            onChange={changeHandler}/>
    );
};