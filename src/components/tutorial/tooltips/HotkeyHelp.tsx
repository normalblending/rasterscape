import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {WithTranslation, withTranslation} from "react-i18next";

export interface HotkeyHelpStateProps {
}

export interface HotkeyHelpActionProps {
}

export interface HotkeyHelpOwnProps {

}

export interface HotkeyHelpProps extends HotkeyHelpStateProps, HotkeyHelpActionProps, HotkeyHelpOwnProps, WithTranslation {

}

const HotkeyHelpComponent: React.FC<HotkeyHelpProps> = ({t}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'big-text-help'}><span>{t('buttonNumberCF.hotkey')}</span></div>
            <div className={'subheader-help'}>
                <div className={'small-text-help'}><span>
                    {t('buttonNumberCF.backspace')}
                </span></div>
            </div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<HotkeyHelpStateProps, HotkeyHelpOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<HotkeyHelpActionProps, HotkeyHelpOwnProps> = {};

export const HotkeyHelp = connect<HotkeyHelpStateProps, HotkeyHelpActionProps, HotkeyHelpOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(HotkeyHelpComponent));