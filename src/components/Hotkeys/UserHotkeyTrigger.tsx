import * as React from "react";
import * as keyboardjs from "keyboardjs";
import {NodeType} from "../../utils/consts";
import {coordHelper} from "../Area/canvasPosition.servise";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {addHotkey, HotkeyValue} from "../../store/hotkeys";
import {WithTranslation, withTranslation} from "react-i18next";


export interface UserHotkeyTriggerStateProps {
    hotkey?: HotkeyValue
}
export interface UserHotkeyTriggerActionProps {}
export interface UserHotkeyTriggerOwnProps {
    path: string

    onPress?(e?: any, hotkey?: HotkeyValue, data?: any)

    onRelease?(e?: any, hotkey?: HotkeyValue, data?: any)

    data?: any

    name?: string

}

export interface UserHotkeyTriggerProps extends UserHotkeyTriggerStateProps, UserHotkeyTriggerActionProps, UserHotkeyTriggerOwnProps, WithTranslation {
}

export interface UserHotkeyTriggerState {
}

export const INPUT_WITH_HOTKEYS_DATA_ATTRIBUTE = 'data-hotkeys';

export class UserHotkeyTriggerComponent extends React.PureComponent<UserHotkeyTriggerProps, UserHotkeyTriggerState> {

    handlePress = e => {
        const { hotkey } = this.props;


        coordHelper.writeln(e.key, hotkey?.key, hotkey?.code);
        if (e.key !== hotkey?.key) {
            console.log(234, e.key, hotkey?.key, hotkey?.code);
            return;
        }

        if (document.activeElement.nodeName === NodeType.Input
            // && (!document.activeElement.getAttribute(INPUT_WITH_HOTKEYS_DATA_ATTRIBUTE)
            //     || this.props.keys.length === 1)
        ) {
            return;
        }

        e.preventRepeat();
        const {onPress, data} = this.props;
        onPress && onPress(e, hotkey, data);
    };

    handleRelease = e => {
        const { hotkey } = this.props;

        if (e.key !== hotkey?.key) {
            console.log(234, e.key, hotkey?.key, hotkey?.code);
            return;
        }
        if (document.activeElement.nodeName === NodeType.Input
            // && (!document.activeElement.getAttribute(INPUT_WITH_HOTKEYS_DATA_ATTRIBUTE)
            //     || this.props.keys.length === 1)
        ) {
            return;
        }

        const {onRelease, data} = this.props;
        onRelease && onRelease(e, hotkey, data);
    };

    componentDidMount() {
        const {hotkey} = this.props;
        console.log(hotkey?.code);
        if (hotkey?.code)
            keyboardjs.bind(hotkey?.code, this.handlePress, this.handleRelease)
    }

    componentDidUpdate(prevProps) {
        const {hotkey} = this.props;

        console.log(hotkey?.code);

        if (hotkey?.code && prevProps.hotkey?.code !== hotkey?.code) {
            if (prevProps.hotkey?.code) {
                keyboardjs.unbind(prevProps.hotkey.code, this.handlePress, this.handleRelease);
            }
            
            if (hotkey?.code)
                keyboardjs.bind(hotkey?.code, this.handlePress, this.handleRelease);
        }
    }

    componentWillUnmount() {

        this.props.hotkey?.code && keyboardjs.unbind(this.props.hotkey?.code, this.handlePress, this.handleRelease);
    }

    render() {
        return <></>;
    }
}


const mapStateToProps: MapStateToProps<UserHotkeyTriggerStateProps, UserHotkeyTriggerOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    value: state.hotkeys.keys[path]?.key,
});

const mapDispatchToProps: MapDispatchToProps<UserHotkeyTriggerActionProps, UserHotkeyTriggerOwnProps> = {
    addHotkey,
};

export const UserHotkeyTrigger = connect<UserHotkeyTriggerStateProps, UserHotkeyTriggerActionProps, UserHotkeyTriggerOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(UserHotkeyTriggerComponent));