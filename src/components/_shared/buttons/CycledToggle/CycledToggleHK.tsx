import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../../store";
import {Button, ButtonProps} from "bbuutoonnss";
import {ShortcutInput} from "../../ShortcutInput";
import {HoverHideable} from "../../HoverHideable";
import {WithTranslation, withTranslation} from "react-i18next";
import {addHotkey} from "../../../../store/hotkeys";
import {ButtonSelect, ButtonSelectProps} from "../ButtonSelect";
import {Key} from "../../Key";
import './styles.scss';
import {CycledToggle, CycledToggleImperativeHandlers, CycledToggleProps} from "./CycledToggle";

export interface CycledToggleHKStateProps {
    hotkey: string
    settingMode: boolean
}

export interface CycledToggleHKActionProps {
    addHotkey(path: string, value: string)
}

export interface CycledToggleHKOwnProps extends CycledToggleProps {
    path: string
}

export interface CycledToggleHKProps extends CycledToggleHKStateProps, CycledToggleHKActionProps, CycledToggleHKOwnProps, WithTranslation {

}

const CycledToggleHKComponent: React.FC<CycledToggleHKProps> = (props) => {

    const {
        t,
        hotkey,
        addHotkey,
        path,
        settingMode,
        ...buttonProps
    } = props;

    const {
        value,
        name,
        selected,
        onClick,
    } = buttonProps;

    const buttonRef = React.useRef<CycledToggleImperativeHandlers>();

    const handleShortcutChange = React.useCallback((shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut);
            // if (shortcut !== null)
            //     e.target.blur();
        }
    }, [addHotkey, path, settingMode]);

    const handleRelease = React.useCallback((e) => {

        if (settingMode)
            return;

        buttonRef.current?.click(e);
    }, [buttonRef, settingMode]);

    return (
        <div className={'hotkey-cycled-toggle'}>
            <CycledToggle
                ref={buttonRef}
                {...buttonProps} />
            {settingMode && (
                <ShortcutInput
                    placeholder={t('buttonNumberCF.hotkey')}
                    value={hotkey}
                    onChange={handleShortcutChange}
                />
            )}
            <Key
                keys={hotkey}
                onRelease={handleRelease}
            />
        </div>
    );
};

const mapStateToProps: MapStateToProps<CycledToggleHKStateProps, CycledToggleHKOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    settingMode: state.hotkeys.setting,
});

const mapDispatchToProps: MapDispatchToProps<CycledToggleHKActionProps, CycledToggleHKOwnProps> = {
    addHotkey,
};

export const CycledToggleHK = connect<CycledToggleHKStateProps, CycledToggleHKActionProps, CycledToggleHKOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(CycledToggleHKComponent));