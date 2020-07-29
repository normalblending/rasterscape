import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {WithTranslation, withTranslation} from "react-i18next";

export interface BrushSizeStateProps {
}

export interface BrushSizeActionProps {
}

export interface BrushSizeOwnProps {

}

export interface BrushSizeProps extends BrushSizeStateProps, BrushSizeActionProps, BrushSizeOwnProps, WithTranslation {

}

const BrushSizeComponent: React.FC<BrushSizeProps> = ({t}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'big-text-help'}><span>
                {t('brush.size')}
            </span></div>
            <div className={'subheader-help'}><span>
            <div className={'small-text-help'}><span>
                {t('brush.howToSeeMenu.hover')}
                <span className={'help-red-text'}>▮</span>
                {t('brush.howToSeeMenu.toSeeMenu')}</span></div>
            </span></div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<BrushSizeStateProps, BrushSizeOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<BrushSizeActionProps, BrushSizeOwnProps> = {};

export const BrushSizeHelp = connect<BrushSizeStateProps, BrushSizeActionProps, BrushSizeOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BrushSizeComponent));