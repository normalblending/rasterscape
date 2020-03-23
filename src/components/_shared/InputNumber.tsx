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

let timer;

export const InputNumber: React.FC<InputNumberProps> = ({className, value, onChange, min = 0, max = 1, step = 0.05, delay, notZero}) => {

    const [_value, set_value] = React.useState(value);

    React.useEffect(() => {
        value !== _value && !timer && set_value(value)
    });

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
                clearTimeout(timer);
                timer = null; // чистим таймер чтобы обновлять значение из пропсов только когда таймер не запущен

            }, delay)
        }
    };

    return (
        <input
            className={classnames("input-number", className)}
            type="number"
            step={step}
            min={min}
            max={max}
            value={_value}
            onChange={changeHandler}/>
    );
};