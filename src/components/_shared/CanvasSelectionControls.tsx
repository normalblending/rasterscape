import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Params} from "./Params";

export interface CanvasSelectionControlsStateProps {
    paramsConfig: object
    paramsValue: object
}

export interface CanvasSelectionControlsActionProps {
    setSelectionParams(params: object)
}

export interface CanvasSelectionControlsOwnProps {

}

export interface CanvasSelectionControlsProps extends CanvasSelectionControlsStateProps, CanvasSelectionControlsActionProps, CanvasSelectionControlsOwnProps {

}

const CanvasSelectionControlsComponent: React.FC<CanvasSelectionControlsProps> = ({paramsValue, paramsConfig, setSelectionParams}) => {

    return (
        <Params
            data={paramsConfig}
            value={paramsValue}
            onChange={setSelectionParams}/>
    );
};

const mapStateToProps: MapStateToProps<CanvasSelectionControlsStateProps, CanvasSelectionControlsOwnProps, AppState> = state => ({
    paramsConfig: null,
    paramsValue: null,
});

const mapDispatchToProps: MapDispatchToProps<CanvasSelectionControlsActionProps, CanvasSelectionControlsOwnProps> = {
    setSelectionParams: null
};

export const canvasSelectionControlsConnect = connect<CanvasSelectionControlsStateProps, CanvasSelectionControlsActionProps, CanvasSelectionControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(CanvasSelectionControlsComponent);