import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Tooltip, TooltipProps} from "../_shared/Tooltip";
import {ToolsOwnProps, ToolsProps} from "../Tools";
import {coordHelper} from "../Area/canvasPosition.servise";

export interface HelpTooltipStateProps {
    active: boolean
}

export interface HelpTooltipActionProps {
}

export interface HelpTooltipOwnProps extends TooltipProps {
    children

}

export interface HelpTooltipProps extends HelpTooltipStateProps, HelpTooltipActionProps, HelpTooltipOwnProps {

}

const HelpTooltipComponent: React.FC<HelpTooltipProps> = ({active, children, ...tooltipProps}) => {

    // coordHelper.setText(active);
    return (active ?
        <Tooltip {...tooltipProps}
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
)(HelpTooltipComponent);