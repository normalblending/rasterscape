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
            <div className={'small-text-help'}><span>
                right and top from red point <span className={'help-red-text red-point-text'}>.</span> to increase
            </span></div>
            <div className={'small-text-help'}><span>
                left and bottom from red point <span className={'help-red-text red-point-text'}>.</span> to decrease
            </span></div>
            <div className={'subheader-help'}>
            <div className={'small-text-help'}><span>
                click different quarters of slider to fine-tune the value
            </span></div>
            </div>
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