import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Params} from "./Params";
import {WindowState} from "../../store/mainWindow/reducer";
import {windowSelectors} from "../../store/_shared/window/selectors";

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

export const canvasSelectionControlsConnect = (getWindowState: (state: AppState) => WindowState, setParamsAction) => {

    const WindowSelectors = windowSelectors(getWindowState);

    const mapStateToProps: MapStateToProps<CanvasSelectionControlsStateProps, CanvasSelectionControlsOwnProps, AppState> = state => ({
        paramsConfig: WindowSelectors.getSelectionParamsConfig(state),
        paramsValue: WindowSelectors.getSelectionParams(state),
    });

    const mapDispatchToProps: MapDispatchToProps<CanvasSelectionControlsActionProps, CanvasSelectionControlsOwnProps> = {
        setSelectionParams: setParamsAction
    };

    return connect<CanvasSelectionControlsStateProps, CanvasSelectionControlsActionProps, CanvasSelectionControlsOwnProps, AppState>(
        mapStateToProps,
        mapDispatchToProps
    )(CanvasSelectionControlsComponent);
};