import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {WithTranslation, withTranslation} from "react-i18next";

export interface ChangeFunctionsHelpStateProps {
    isThereChangeF: boolean
    isCFSelected: boolean
}

export interface ChangeFunctionsHelpActionProps {
}

export interface ChangeFunctionsHelpOwnProps {
    path: string
}

export interface ChangeFunctionsHelpProps extends ChangeFunctionsHelpStateProps, ChangeFunctionsHelpActionProps, ChangeFunctionsHelpOwnProps, WithTranslation {

}

const ChangeFunctionsHelpComponent: React.FC<ChangeFunctionsHelpProps> = ({isThereChangeF, isCFSelected, t}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'big-text-help'}><span>{t('buttonNumberCF.changeFunction')}</span></div>
            <div className={'subheader-help'}>
                <div className={'small-text-help'}>
                    <span>
                        {t('buttonNumberCF.cf1')}
                    change function allows you <br/>
                    to change the value during drawing<br/>
                    depending on the time, coordinates<br/>
                    and other parameters
                    </span>
                </div>
            </div>
            {!isThereChangeF ?
            <div className={'subheader-help'}>
                <div className={'small-text-help'}>
                    <span>
                    this list is empty yet<br/>
                    u can add one by clicking<br/>
                    sin, loop, parab, depth <br/>
                    in the right part of tools menu
                    </span>
                </div>
            </div> :
                (!isCFSelected ? <div className={'subheader-help'}>
                    <div className={'small-text-help'}>
                    <span>
                    select change function
                    </span>
                    </div>
                </div> : <div className={'subheader-help'}>
                    <div className={'small-text-help'}>
                    <span>
                    click selected item to clear selection
                    </span>
                    </div>
                </div>)}
            {/*<div className={'subheader-help'}>hover <span className={'help-red-text'}>◧</span> to see slider menu</div>*/}
        </div>
    );
};

const mapStateToProps: MapStateToProps<ChangeFunctionsHelpStateProps, ChangeFunctionsHelpOwnProps, AppState> = (state, {path}) => ({
    isThereChangeF: state.changeFunctions.namesList.length > 0,
    isCFSelected: !!state.changingValues[path]
});

const mapDispatchToProps: MapDispatchToProps<ChangeFunctionsHelpActionProps, ChangeFunctionsHelpOwnProps> = {};

export const ChangeFunctionsHelp = connect<ChangeFunctionsHelpStateProps, ChangeFunctionsHelpActionProps, ChangeFunctionsHelpOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ChangeFunctionsHelpComponent));