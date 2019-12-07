import * as React from "react";
import {InputText} from "./InputText";
import * as keyboardjs from "keyboardjs";
import "../../styles/inputShortcut.scss";

export interface ShortcutInputProps {
    onChange(value: string)

    value: string


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
        const {value} = this.props;
        return (
            <InputText
                className={"shortcut-input"}
                value={value}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={() => {return;
                }}/>
        );
    }
}