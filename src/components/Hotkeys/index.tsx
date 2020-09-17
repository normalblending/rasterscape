import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import './styles.scss';
import {
    clearHotkeys,
    highlightHotkey,
    HotkeyControlType,
    HotkeyValue,
    removeHotkey,
    settingMode,
    updateHotkey
} from "../../store/hotkeys";
import {createSelector} from "reselect";
import {Button} from "bbuutoonnss";
import {WithTranslation, withTranslation} from "react-i18next";
import {ShortcutInput} from "../_shared/inputs/ShortcutInput";
import {ButtonSelect} from "../_shared/buttons/simple/ButtonSelect";


export interface HotkeysStateProps {
    hotkeys: HotkeyValue[]
    isSettingMode: boolean
}

export interface HotkeysActionProps {

    updateHotkey: typeof updateHotkey

    removeHotkey(path: string)

    settingMode(state: boolean)

    clearHotkeys()

    highlightHotkey(path: string)
}

export interface HotkeysOwnProps {

}

export interface HotkeysProps extends HotkeysStateProps, HotkeysActionProps, HotkeysOwnProps, WithTranslation {

}

const HotkeysComponent: React.FC<HotkeysProps> = (props) => {

    const {
        hotkeys,
        settingMode,
        clearHotkeys,
        isSettingMode,
        t,
        highlightHotkey,
        removeHotkey,
        updateHotkey,
    } = props;

    const toggleHotkeys = React.useCallback(() => {
        settingMode(!isSettingMode);
    }, [isSettingMode, settingMode]);


    const handleShortcutChange = React.useCallback((shortcut, hotkey: HotkeyValue) => {
        if (shortcut?.length === 1 || shortcut === null) {
            updateHotkey(hotkey.path, {key: shortcut});
        }
    }, [updateHotkey]);

    const handleShortcutParamChange = React.useCallback(({value: hotkey, selected}) => {
        updateHotkey(hotkey.path, {
            onRelease: !selected
        });
    }, [updateHotkey]);


    const handleShortcutFocus = React.useCallback((shortcut, hotkey: HotkeyValue) => {
        highlightHotkey(hotkey.path);
    }, [highlightHotkey]);

    const handleShortcutBlur = React.useCallback((shortcut, hotkey: HotkeyValue) => {
        if (shortcut === null) {
            removeHotkey(hotkey.path);
        }

        highlightHotkey(null);
    }, [removeHotkey, highlightHotkey]);

    return (
        <div className={'hotkeys'}>
            <Button
                className="app-control-button"
                onClick={toggleHotkeys}>hk</Button>
            {isSettingMode && (
                <div className={'hotkeys-list'}>
                    <Button onClick={clearHotkeys}>clear</Button>
                    {hotkeys.map((hotkey, index) => {
                        const {key, label, labelData, path, onRelease, controlType} = hotkey;
                        return (
                            <div className={'hotkeys-list-item'} key={path}>
                                <div className={'hotkey-on-release'}>
                                    {[
                                        HotkeyControlType.Button,
                                        HotkeyControlType.Cycled,
                                    ].includes(controlType) && (
                                        <ButtonSelect
                                            selected={onRelease}
                                            value={hotkey}
                                            onClick={handleShortcutParamChange}
                                        >{onRelease ? '˄' : '˅'}</ButtonSelect>
                                    )}
                                </div>
                                <ShortcutInput
                                    hotkey={hotkey}
                                    onBlur={handleShortcutBlur}
                                    onChange={handleShortcutChange}
                                    onFocus={handleShortcutFocus}
                                    value={key}
                                />
                                <div className={'hotkey-name'}>
                                    {t(label, {
                                        data1: labelData?.[0],
                                        data2: labelData?.[1],
                                        data3: labelData?.[2],
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};


const hotkeysSelector = createSelector(
    [(state: AppState) => state.hotkeys.keys],
    (hotkeys) => Object.values(hotkeys));

const mapStateToProps: MapStateToProps<HotkeysStateProps, HotkeysOwnProps, AppState> = state => ({
    hotkeys: hotkeysSelector(state),
    isSettingMode: state.hotkeys.setting,
});

const mapDispatchToProps: MapDispatchToProps<HotkeysActionProps, HotkeysOwnProps> = {
    updateHotkey,
    removeHotkey,
    settingMode,
    clearHotkeys,
    highlightHotkey,
};

export const Hotkeys = connect<HotkeysStateProps, HotkeysActionProps, HotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(HotkeysComponent));