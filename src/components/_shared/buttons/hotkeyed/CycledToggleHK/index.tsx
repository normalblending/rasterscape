import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../../../store";
import * as classNames from 'classnames';
import {ShortcutInput} from "../../../inputs/ShortcutInput";
import {WithTranslation, withTranslation} from "react-i18next";
import {addHotkey, HotkeyControlType, HotkeyValue} from "../../../../../store/hotkeys";
import {Key} from "../../../Key";
import './styles.scss';
import {CycledToggle, CycledToggleImperativeHandlers, CycledToggleProps} from "../../simple/CycledToggle";

export interface CycledToggleHKStateProps {
    hotkey: HotkeyValue
    settingMode: boolean
    highlightedPath: string
}

export interface CycledToggleHKActionProps {
    addHotkey: typeof addHotkey
}

export interface CycledToggleHKOwnProps extends CycledToggleProps {
    path: string
    hkLabel?: string
}

export interface CycledToggleHKProps extends CycledToggleHKStateProps, CycledToggleHKActionProps, CycledToggleHKOwnProps, WithTranslation {

}

const CycledToggleHKComponent: React.FC<CycledToggleHKProps> = (props) => {

    const {
        t,
        hotkey,
        addHotkey,
        path,
        hkLabel,
        settingMode,
        highlightedPath,
        ...buttonProps
    } = props;

    const {
        value,
        name,
        selected,
        onClick,
    } = buttonProps;

    const [pressed, setPressed] = React.useState(false);

    const isOnRelease = hotkey?.onRelease;

    const buttonRef = React.useRef<CycledToggleImperativeHandlers>();

    const handleShortcutChange = React.useCallback((shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut, HotkeyControlType.Cycled, hkLabel || path);
        }
    }, [addHotkey, path, settingMode, hkLabel, path]);

    const handlePress = React.useCallback((e) => {

        setPressed(true);

        if (settingMode || isOnRelease)
            return;

        buttonRef.current?.click(e);

        setTimeout(setPressed, 200, false);
    }, [buttonRef, settingMode, isOnRelease]);

    const handleRelease = React.useCallback((e) => {

        if (settingMode || !isOnRelease)
            return;

        buttonRef.current?.click(e);

        setPressed(false);

    }, [buttonRef, settingMode, isOnRelease]);

    return (
        <div className={classNames('hotkey-cycled-toggle', {
            ['hotkey-highlighted']: highlightedPath === hotkey?.path
        })}>
            <CycledToggle
                pressed={pressed}
                ref={buttonRef}
                {...buttonProps} />
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

const mapStateToProps: MapStateToProps<CycledToggleHKStateProps, CycledToggleHKOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    settingMode: state.hotkeys.setting,
    highlightedPath: state.hotkeys.highlightedPath,
});

const mapDispatchToProps: MapDispatchToProps<CycledToggleHKActionProps, CycledToggleHKOwnProps> = {
    addHotkey,
};

export const CycledToggleHK = connect<CycledToggleHKStateProps, CycledToggleHKActionProps, CycledToggleHKOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(CycledToggleHKComponent));