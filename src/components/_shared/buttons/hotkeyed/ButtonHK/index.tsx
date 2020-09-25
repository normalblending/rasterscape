import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../../../store";
import {Button, ButtonProps} from "bbuutoonnss";
import {ShortcutInput} from "../../../inputs/ShortcutInput";
import {HoverHideable} from "../../../HoverHideable";
import {WithTranslation, withTranslation} from "react-i18next";
import {addHotkey, HotkeyControlType, HotkeyValue} from "../../../../../store/hotkeys";
import {ButtonSelect, ButtonSelectProps} from "../../simple/ButtonSelect";
import * as classNames from 'classnames';
import {Key} from "../../../Key";
import './styles.scss';
import {homedir} from "os";

export interface ButtonHKStateProps {
    hotkey: HotkeyValue
    settingMode: boolean
    highlightedPath: string
}

export interface ButtonHKActionProps {
    addHotkey: typeof addHotkey
}

export interface ButtonHKOwnProps extends ButtonSelectProps {
    path: string
    hkLabel?: string
    containerClassName?: string

    hkData1?: any
    hkData2?: any
    hkData3?: any
}

export interface ButtonHKProps extends ButtonHKStateProps, ButtonHKActionProps, ButtonHKOwnProps, WithTranslation {

}

const ButtonHKComponent: React.FC<ButtonHKProps> = (props) => {

    const {
        t,
        hotkey,
        addHotkey,
        path,
        settingMode,
        containerClassName,
        highlightedPath,
        hkLabel,
        hkData1,
        hkData2,
        hkData3,
        ...buttonProps
    } = props;

    const [pressed, setPressed] = React.useState(false);

    const isOnRelease = hotkey?.onRelease;

    const {
        disabled,
        value,
        name,
        selected,
        onClick,
    } = buttonProps

    const handleShortcutChange = React.useCallback((shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut, HotkeyControlType.Button, hkLabel || path, [hkData1, hkData2, hkData3]);
        }
    }, [addHotkey, path, settingMode, hkLabel, hkData1, hkData2, hkData3]);

    const handlePress = React.useCallback((e) => {

        setPressed(true);

        if (settingMode || disabled || isOnRelease)
            return;

        onClick && onClick({
            e,
            value,
            name,
            selected
        });

        setTimeout(setPressed, 200, false);

    }, [onClick, value, name, selected, settingMode, disabled, isOnRelease]);

    const handleRelease = React.useCallback((e) => {

        if (settingMode || disabled || !isOnRelease)
            return;

        onClick && onClick({
            e,
            value,
            name,
            selected
        });

        setPressed(false);

    }, [onClick, value, name, selected, settingMode, disabled, isOnRelease]);

    return (
        <div className={classNames('hotkey-button', {
            ['hotkey-highlighted']: highlightedPath === hotkey?.path
        }, containerClassName)}>
            <ButtonSelect {...buttonProps} pressed={pressed}/>
            {settingMode && (
                <ShortcutInput
                    placeholder={t('buttonNumberCF.hotkey')}
                    value={hotkey?.key}
                    onChange={handleShortcutChange}
                />
            )}
            {!settingMode && hotkey?.key && (
                <div className={'hotkey-key'}>{hotkey?.key}</div>
            )}
            <Key
                keys={hotkey?.key}
                onRelease={handleRelease}
                onPress={handlePress}
            />
        </div>
    );
};

const mapStateToProps: MapStateToProps<ButtonHKStateProps, ButtonHKOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    settingMode: state.hotkeys.setting,
    highlightedPath: state.hotkeys.highlightedPath,
});

const mapDispatchToProps: MapDispatchToProps<ButtonHKActionProps, ButtonHKOwnProps> = {
    addHotkey,
};

export const ButtonHK = connect<ButtonHKStateProps, ButtonHKActionProps, ButtonHKOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ButtonHKComponent));