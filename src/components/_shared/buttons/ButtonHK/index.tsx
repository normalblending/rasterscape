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

export interface ButtonHKStateProps {
    hotkey: string
    settingMode: boolean
}

export interface ButtonHKActionProps {
    addHotkey(path: string, value: string)
}

export interface ButtonHKOwnProps extends ButtonSelectProps {
    path: string
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
        ...buttonProps
    } = props;

    const {
        disabled,
        value,
        name,
        selected,
        onClick,
    } = buttonProps

    const handleShortcutChange = React.useCallback((shortcut, e) => {
        if (shortcut === null || shortcut.length === 1) {
            addHotkey(path, shortcut);
            // if (shortcut !== null)
            //     e.target.blur();
        }
    }, [addHotkey, path, settingMode]);

    const handleRelease = React.useCallback((e) => {

        if (settingMode || disabled)
            return;

        onClick && onClick({
            e,
            value,
            name,
            selected
        });

    }, [onClick, value, name, selected, settingMode, disabled]);

    return (
        <div className={'hotkey-button'}>
            <ButtonSelect {...buttonProps} />
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

const mapStateToProps: MapStateToProps<ButtonHKStateProps, ButtonHKOwnProps, AppState> = (state, {path}) => ({
    hotkey: state.hotkeys.keys[path],
    settingMode: state.hotkeys.setting,
});

const mapDispatchToProps: MapDispatchToProps<ButtonHKActionProps, ButtonHKOwnProps> = {
    addHotkey,
};

export const ButtonHK = connect<ButtonHKStateProps, ButtonHKActionProps, ButtonHKOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ButtonHKComponent));