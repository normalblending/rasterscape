import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";

export interface BrushSizeStateProps {
}

export interface BrushSizeActionProps {
}

export interface BrushSizeOwnProps {

}

export interface BrushSizeProps extends BrushSizeStateProps, BrushSizeActionProps, BrushSizeOwnProps {

}

const BrushSizeComponent: React.FC<BrushSizeProps> = ({}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'big-text-help'}><span>
                brush size
            </span></div>
            <div className={'subheader-help'}><span>
                hold and move to change value
            </span></div>
            <div className={'subheader-help'}><span>
                hover <span className={'help-red-text'}>◧</span> to see slider menu
            </span></div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<BrushSizeStateProps, BrushSizeOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<BrushSizeActionProps, BrushSizeOwnProps> = {};

export const BrushSizeHelp = connect<BrushSizeStateProps, BrushSizeActionProps, BrushSizeOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(BrushSizeComponent);