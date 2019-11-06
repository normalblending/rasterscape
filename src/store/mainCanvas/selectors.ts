import {createSelector} from "reselect";
import {MainCanvasState} from "./reducer";
import {CurveValueName} from "../../components/_shared/CanvasSelector";

const getMainCanvasState = state => state.mainCanvas;


export const MainCanvasSelector = {
    getMainCanvasState,
    getSelectionValue: createSelector(
        [getMainCanvasState],
        (state: MainCanvasState) => state.selection.value),
    getSelectionParams: createSelector(
        [getMainCanvasState],
        (state: MainCanvasState) => ({
            ...state.selection.params,
            curveValue: state.selection.params[CurveValueName[state.selection.params.curveType]]})),
    getSelectionParamsConfig: createSelector(
        [getMainCanvasState],
        (state: MainCanvasState) => state.selection.paramsConfig),

};