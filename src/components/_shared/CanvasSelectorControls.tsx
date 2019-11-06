import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store/index";
import {Params} from "./Params";
import {WindowState} from "../../store/mainCanvas/reducer";
import {windowSelectors} from "../../store/_shared/canvas/selectors";

export interface CanvasSelectorControlsStateProps {
    paramsConfig: object
    paramsValue: object
}

export interface CanvasSelectorControlsActionProps {
    setSelectionParams(params: object)
}

export interface CanvasSelectorControlsOwnProps {

}

export interface CanvasSelectorControlsProps extends CanvasSelectorControlsStateProps, CanvasSelectorControlsActionProps, CanvasSelectorControlsOwnProps {

}

const CanvasSelectorControlsComponent: React.FC<CanvasSelectorControlsProps> = ({paramsValue, paramsConfig, setSelectionParams}) => {

    return (
        <Params
            data={paramsConfig}
            value={paramsValue}
            onChange={setSelectionParams}/>
    );
};

export const canvasSelectorControlsConnect = (getWindowState: (state: AppState) => WindowState, setParamsAction) => {

    const WindowSelectors = windowSelectors(state => state.mainCanvas);

    const mapStateToProps: MapStateToProps<CanvasSelectorControlsStateProps, CanvasSelectorControlsOwnProps, AppState> = state => ({
        paramsConfig: WindowSelectors.getSelectionParamsConfig(state),
        paramsValue: WindowSelectors.getSelectionParams(state),
    });

    const mapDispatchToProps: MapDispatchToProps<CanvasSelectorControlsActionProps, CanvasSelectorControlsOwnProps> = {
        setSelectionParams: setParamsAction
    };

    return connect<CanvasSelectorControlsStateProps, CanvasSelectorControlsActionProps, CanvasSelectorControlsOwnProps, AppState>(
        mapStateToProps,
        mapDispatchToProps
    )(CanvasSelectorControlsComponent);
};