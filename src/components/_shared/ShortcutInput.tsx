import * as React from "react";
import {InputText} from "./InputText";
import * as keyboardjs from "keyboardjs";
import * as classNames from 'classnames';
import "../../styles/inputShortcut.scss";

export interface ShortcutInputProps {
    onChange(value: string, e)

    value: string
    placeholder?: string

}

export interface ShortcutInputState {

}

export class ShortcutInput extends React.PureComponent<ShortcutInputProps, ShortcutInputState> {

    handleChange = (e) => {
        if (e.key.length === 1 || e.key === "Backspace") {
            const value = e.key === "Backspace" ? null : e.key
            this.props.onChange(value, e);
            // if (value)
            //     keyboardjs.unbind("", this.handleChange)

        }
    };

    handleFocus = () => {
        keyboardjs.bind("", this.handleChange)
    };

    handleBlur = () => {
        keyboardjs.unbind("", this.handleChange)
    };


    render() {
        const {value, placeholder} = this.props;
        return (
            <InputText
                className={classNames("shortcut-input", {
                    ['empty']: !value
                })}
                value={value}
                // placeholder={placeholder}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}/>
        );
    }
}