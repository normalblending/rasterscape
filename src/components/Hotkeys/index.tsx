import * as React from "react";
import * as cn from "classnames";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import './styles.scss';
import {
    clearHotkeys,
    highlightHotkey,
    HotkeyControlType,
    HotkeyValue,
    removeHotkey, setAutoblur, setAutofocus,
    settingMode,
    updateHotkey
} from "../../store/hotkeys";
import {createSelector} from "reselect";
import {Button} from "../_shared/buttons/simple/Button";
import {WithTranslation, withTranslation} from "react-i18next";
import {ShortcutInput} from "./ShortcutInput";
import {ButtonSelect} from "../_shared/buttons/simple/ButtonSelect";
import {labelFormatters} from "../../store/hotkeys/label-formatters";
import {InputText} from "../_shared/inputs/InputText";
import {GlobalHotkeysInfo} from "./GlobalHotkeysInfo";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";
import {GlobalHotkeys} from "./GlobalHotkeys";


export interface HotkeysStateProps {
    hotkeys: HotkeyValue[]
    isSettingMode: boolean
    autofocus: boolean
    autoblur: boolean
}

export interface HotkeysActionProps {

    updateHotkey: typeof updateHotkey

    removeHotkey(path: string)

    settingMode(state: boolean)

    clearHotkeys()

    highlightHotkey(path: string)

    setAutofocus(value: boolean)

    setAutoblur(value: boolean)
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
        setAutofocus,
        setAutoblur,
        autoblur,
        autofocus
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


    const handleSetAutofocus = React.useCallback((data) => {
        setAutofocus(!data.selected);
    }, [setAutofocus]);

    const handleSetAutoblur = React.useCallback((data) => {
        setAutoblur(!data.selected);
    }, [setAutoblur]);

    return (
        <div className={'hotkeys'}>
            {isSettingMode && (
                <div className={'hotkeys-list'}>
                    <div className={'settings'}>

                    </div>
                    <>
                        <div className={'hotkeys-list-controls'}>
                            {!!hotkeys.length && (
                                <ButtonHK onClick={clearHotkeys}>{t('utils.clear')}</ButtonHK>

                            )}
                            <ButtonSelect
                                autofocus
                                autoblur={autoblur}
                                selected={autofocus}
                                onClick={handleSetAutofocus}
                            >
                                {t('utils.autofocus')}
                            </ButtonSelect>
                            <ButtonSelect
                                autoblur
                                autofocus={autofocus}
                                selected={autoblur}
                                onClick={handleSetAutoblur}
                            >
                                {t('utils.autoblur')}
                            </ButtonSelect>
                        </div>
                        <div className={'hotkeys-list-items'}>
                            {!hotkeys.length && (
                                <div
                                    className={'no-user-hotkeys'}
                                >{t('hotkeys.empty')}</div>
                            )}
                            {hotkeys.map((hotkey, index) => {
                                const {
                                    key,
                                    label,
                                    labelData,
                                    labelFormatter,
                                    path,
                                    onRelease,
                                    controlType
                                } = hotkey;

                                const data = {
                                    data0: labelData?.[0],
                                    data1: labelData?.[1],
                                    data2: labelData?.[2],
                                    data3: labelData?.[3],
                                };

                                const text = (labelFormatter && labelFormatters[labelFormatter])
                                    ? labelFormatters[labelFormatter](t, label, data)
                                    : t(label, data);

                                return (
                                    <div className={'hotkeys-list-item'} key={path}>
                                        <div className={'hotkey-on-release'}>
                                            {[
                                                HotkeyControlType.Button,
                                                HotkeyControlType.Cycled,
                                            ].includes(controlType) && (
                                                <ButtonSelect
                                                    autofocus={autofocus}
                                                    autoblur={autoblur}
                                                    selected={onRelease}
                                                    value={hotkey}
                                                    onClick={handleShortcutParamChange}
                                                >{onRelease ? '˄' : '˅'}</ButtonSelect>
                                            )}
                                        </div>
                                        <ShortcutInput
                                            autofocus={autofocus}
                                            autoblur={autoblur}
                                            hotkey={hotkey}
                                            onBlur={handleShortcutBlur}
                                            onChange={handleShortcutChange}
                                            onFocus={handleShortcutFocus}
                                            value={key}
                                        />
                                        <div className={'hotkey-name'}>
                                            {text}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                    <GlobalHotkeysInfo/>
                </div>
            )}
            <GlobalHotkeys/>
            <Button
                autofocus
                className={cn("app-control-button", {
                    "app-control-button__selected": isSettingMode
                })}
                onClick={toggleHotkeys}>{t('globalHotkeys.hk')}</Button>
        </div>
    );
};


const hotkeysSelector = createSelector(
    [(state: AppState) => state.hotkeys.keys],
    (hotkeys) => Object.values(hotkeys));

const mapStateToProps: MapStateToProps<HotkeysStateProps, HotkeysOwnProps, AppState> = state => ({
    hotkeys: hotkeysSelector(state),
    isSettingMode: state.hotkeys.setting,
    autofocus: state.hotkeys.autofocus,
    autoblur: state.hotkeys.autoblur,
});

const mapDispatchToProps: MapDispatchToProps<HotkeysActionProps, HotkeysOwnProps> = {
    updateHotkey,
    removeHotkey,
    settingMode,
    clearHotkeys,
    highlightHotkey,
    setAutofocus,
    setAutoblur,
};

export const Hotkeys = connect<HotkeysStateProps, HotkeysActionProps, HotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(HotkeysComponent));