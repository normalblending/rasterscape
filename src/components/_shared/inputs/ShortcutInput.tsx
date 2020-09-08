import * as React from "react";
import {InputText} from "./InputText";
import * as keyboardjs from "keyboardjs";
import * as classNames from 'classnames';
import "../../../styles/inputShortcut.scss";
import {HotkeyValue} from "store/hotkeys";

export interface ShortcutInputProps {
    onChange?(value: string, hotkey: HotkeyValue)
    onBlur?(value: string, hotkey: HotkeyValue)
    onFocus?(value: string, hotkey: HotkeyValue)

    value: string
    placeholder?: string

    hotkey?: HotkeyValue

}

export interface ShortcutInputState {
    value: string
}

export class ShortcutInput extends React.PureComponent<ShortcutInputProps, ShortcutInputState> {

    inputRef;

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        }

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<ShortcutInputProps>, prevState: Readonly<ShortcutInputState>, snapshot?: any) {
        console.log(this.props.value, prevProps.value);
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value});
        }
    }

    handleChange = (e) => {
        console.log(e);
        if (e.pressedKeys.length === 1 && (e.key.length === 1 || e.key === "Backspace")) {
            const value = e.key === "Backspace" ? null : e.key;

            console.log(value);
            this.setState({value});
            this.props.onChange?.(value, this.props.hotkey);
        }

        if (e.key === 'Enter') {
            this.inputRef.current?.blur();
        }
    };

    handleFocus = (e?) => {
        this.props.onFocus?.(this.state.value, this.props.hotkey);
        keyboardjs.bind("", this.handleChange)
    };

    handleBlur = (e?) => {
        this.props.onBlur?.(this.state.value, this.props.hotkey);
        keyboardjs.unbind("", this.handleChange)
    };

    componentWillUnmount() {
        this.handleBlur();
    }

    render() {
        const {value, placeholder} = this.props;

        return (
            <InputText
                ref={this.inputRef}
                className={classNames("shortcut-input", {
                    ['empty']: !this.state.value
                })}
                value={this.state.value}
                // placeholder={placeholder}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}/>
        );
    }
}