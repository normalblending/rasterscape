import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Tooltip, TooltipProps} from "../_shared/Tooltip";
import {WithTranslation, withTranslation} from "react-i18next";

export interface HelpTooltipStateProps {
    active: boolean
}

export interface HelpTooltipActionProps {
}

export interface HelpTooltipOwnProps extends TooltipProps {
    children?

}

export interface HelpTooltipProps extends HelpTooltipStateProps, HelpTooltipActionProps, HelpTooltipOwnProps, WithTranslation {

}

const HelpTooltipComponent: React.FC<HelpTooltipProps> = (props) => {

    const {
        t,
        active,
        children,
        message,
        secondaryMessage,
        ...tooltipProps
    } = props;

    return (active ?
            <Tooltip
                {...tooltipProps}
                message={t(message)}
                secondaryMessage={t(secondaryMessage)}
                offsetY={20}
                className={'help-tooltip'}>
                {children}
            </Tooltip> : children
    );
};

const mapStateToProps: MapStateToProps<HelpTooltipStateProps, HelpTooltipOwnProps, AppState> = state => ({
    active: state.tutorial.on
});

const mapDispatchToProps: MapDispatchToProps<HelpTooltipActionProps, HelpTooltipOwnProps> = {};

export const HelpTooltip = connect<HelpTooltipStateProps, HelpTooltipActionProps, HelpTooltipOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(HelpTooltipComponent));