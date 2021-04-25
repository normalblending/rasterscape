import * as React from "react";
import {InputText} from "../_shared/inputs/InputText";
import * as keyboardjs from "keyboardjs";
import * as classNames from 'classnames';
import "./inputShortcut.scss";
import {
    addHotkey, highlightHotkey, HotkeyControlType,
    HotkeyValue, removeHotkey,
} from "store/hotkeys";
import {coordHelper} from "../Area/canvasPosition.servise";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {WithTranslation, withTranslation} from "react-i18next";
import {HKLabelTypes} from "../_shared/buttons/hotkeyed/types";

// keyboardjs.bindKeyCode('KeyA', () => {
//     coordHelper.writeln('--------------------KeyA');
// });

export interface UserHotkeyInputStateProps {
    hotkey?: HotkeyValue
    value: string
    highlightedPath: string
}

export interface UserHotkeyInputActionProps {
    addHotkey: typeof addHotkey
    highlightHotkey: typeof highlightHotkey
    removeHotkey: typeof removeHotkey
}

export interface UserHotkeyInputOwnProps {
    type: HotkeyControlType;
    path: string;
}

export interface UserHotkeyInputProps extends UserHotkeyInputOwnProps, UserHotkeyInputActionProps, UserHotkeyInputStateProps, WithTranslation, HKLabelTypes {

    onBlur?(value: string, hotkey: HotkeyValue)
    onFocus?(value: string, hotkey: HotkeyValue)

    autofocus?: boolean
    autoblur?: boolean

    onMouseEnter?(e)
    onMouseMove?(e)
    onMouseLeave?(e)

}

export interface UserHotkeyInputState {
    value: string
}

export class UserHotkeyInputComponent extends React.PureComponent<UserHotkeyInputProps, UserHotkeyInputState> {

    inputRef;

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        }

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<UserHotkeyInputProps>, prevState: Readonly<UserHotkeyInputState>, snapshot?: any) {
        console.log(this.props.value, prevProps.value);
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value});
        }
    }

    isValidNewKeyEvent = (e) => {

        return !e.altKey && !e.ctrlKey && [
            'Key',
            'Digit',
            'BracketRight',
            'BracketLeft',
            'Backslash',
            'IntlBackslash',
            'Slash',
            'Minus',
            'Equal',
            'Quote',
            'Backquote',
            'Semicolon'
        ].some((code) => e.code.indexOf(code) === 0);
    };
    isDeleteKeyEvent = (e) => {
        return [
            'Backspace',
        ].some((code) => e.code.indexOf(code) === 0);
    };
    isCancelKeyEvent = (e) => {

        return [
            'Enter',
            'Esc',
        ].some((code) => e.code.indexOf(code) === 0);
    };


    handleChange = (e) => {
        console.log(e);
        coordHelper.writeln(e.key, e.code, e.alt);

        if (this.isValidNewKeyEvent(e)) {



            const key = e.key;
            // const codeKeyLow = (e.code as string).slice('Key'.length).toLowerCase();
            const codeKey = e.pressedKeys?.[e.pressedKeys.length - 1];


            this.setState({value: key});
            this.dispatchChange(key, codeKey);

            // this.props.onChange?.(value, this.props.hotkey);
        }

        if (this.isDeleteKeyEvent(e)) {
            const value = null;
            this.setState({value});
            this.dispatchChange(null, null);
            // this.props.onChange?.(value, this.props.hotkey);
        }

        if (this.isCancelKeyEvent(e)) {
            this.inputRef.current?.blur();
        }

    };

    dispatchChange = (newKey, newCode) => {
        const { addHotkey, path, type, hkData0, hkData1, hkData2, hkData3, hkLabelFormatter, hkLabel } = this.props;

        addHotkey({
            path,
            key: newKey,
            code: newCode,
            controlType: type,
            label: hkLabel || path,
            labelFormatter: hkLabelFormatter,
            labelData: [hkData0, hkData1, hkData2, hkData3]
        });
    };

    handleFocus = (e?) => {
        const { highlightHotkey, hotkey, path } = this.props;
        highlightHotkey(path);

        this.props.onFocus?.(this.state.value, hotkey);

        keyboardjs.bind("", this.handleChange)
    };

    handleBlur = (e?) => {
        const { removeHotkey, highlightHotkey, hotkey, path } = this.props;

        if (this.state.value === null) {
            removeHotkey(path);
        }

        highlightHotkey(null);

        this.props.onBlur?.(this.state.value, hotkey);

        keyboardjs.unbind("", this.handleChange);
    };

    componentWillUnmount() {
        this.handleBlur();
    }

    handleMouseEnter = e => {

        const { autofocus, onMouseEnter } = this.props;
        if (autofocus)
            this.inputRef.current?.focus();

        onMouseEnter?.(e);

    }

    handleMove = e => {
        const { autofocus, onMouseMove } = this.props;
        if (autofocus && document.activeElement !== this.inputRef.current)
            this.inputRef.current?.focus();

        onMouseMove?.(e);

    }

    handleMouseLeave = e => {
        const { autoblur, onMouseLeave } = this.props;
        if (autoblur)
            this.inputRef.current?.blur();

        onMouseLeave?.(e);

    }
    render() {
        const {hotkey, highlightedPath} = this.props;

        return (
            <InputText
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMove}
                onMouseLeave={this.handleMouseLeave}

                ref={this.inputRef}
                className={classNames("shortcut-input", {
                    ['empty']: !this.state.value,
                    ['highlighted']: highlightedPath === hotkey?.path
                })}
                value={this.state.value}
                data-hotkeys
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}/>
        );
    }
}


const mapStateToProps: MapStateToProps<UserHotkeyInputStateProps, UserHotkeyInputOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    value: state.hotkeys.keys[path]?.key,
    highlightedPath: state.hotkeys.highlightedPath,
});

const mapDispatchToProps: MapDispatchToProps<UserHotkeyInputActionProps, UserHotkeyInputOwnProps> = {
    addHotkey,
    highlightHotkey,
    removeHotkey,
};

export const UserHotkeyInput = connect<UserHotkeyInputStateProps, UserHotkeyInputActionProps, UserHotkeyInputOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(UserHotkeyInputComponent));