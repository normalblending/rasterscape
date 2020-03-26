import * as React from "react";
import {InputText} from "./InputText";
import * as keyboardjs from "keyboardjs";
import "../../styles/inputShortcut.scss";

export interface ShortcutInputProps {
    onChange(value: string)

    value: string
    placeholder?: string


}

export interface ShortcutInputState {

}

export class ShortcutInput extends React.PureComponent<ShortcutInputProps, ShortcutInputState> {

    handleChange = (e) => {
        this.props.onChange(e.key === "Backspace" ? null : e.key);
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
                className={"shortcut-input"}
                value={value}
                placeholder={placeholder}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={() => {return;
                }}/>
        );
    }
}