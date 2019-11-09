import {createSelector} from "reselect";
import {MainWindowState} from "./reducer";
import {CurveValueName} from "../../components/_shared/CanvasSelection";

const getMainCanvasState = state => state.mainCanvas;

export const MainCanvasSelector = {
    getMainCanvasState,
    getSelectionValue: createSelector(
        [getMainCanvasState],
        (state: MainWindowState) => state.selection.value),
    getSelectionParams: createSelector(
        [getMainCanvasState],
        (state: MainWindowState) => ({
            ...state.selection.params,
            curveValue: state.selection.params[CurveValueName[state.selection.params.curveType]]})),
    getSelectionParamsConfig: createSelector(
        [getMainCanvasState],
        (state: MainWindowState) => state.selection.paramsConfig),

};