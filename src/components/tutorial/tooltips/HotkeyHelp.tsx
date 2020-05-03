import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";

export interface HotkeyHelpStateProps {
}

export interface HotkeyHelpActionProps {
}

export interface HotkeyHelpOwnProps {

}

export interface HotkeyHelpProps extends HotkeyHelpStateProps, HotkeyHelpActionProps, HotkeyHelpOwnProps {

}

const HotkeyHelpComponent: React.FC<HotkeyHelpProps> = ({}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'big-text-help'}><span>hotkey</span></div>
            <div className={'subheader-help'}>
                <div className={'small-text-help'}><span>
                    click this field then press keyboard button<br/>to assign it to control
                </span></div>
            </div>
            <div className={'subheader-help'}>
                <div className={'small-text-help'}><span>
                    then u be able to change value<br/>by moving cursor while pressing this button
                </span></div>
            </div>
            <div className={'subheader-help'}>
                <div className={'small-text-help'}><span>
                    click field and press Backspase<br/>to remove assignment
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
)(HotkeyHelpComponent);