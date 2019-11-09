import {createSelector} from "reselect";
// import {MainWindowState} from "./reducer";
import {CurveValueName} from "../../components/_shared/CanvasSelection";

const getPatternsState = state => state.patterns;

// export const PatternsSelector = {
//     getMainCanvasState,
//     getSelectionValue: createSelector(
//         [getMainCanvasState],
//         (state: MainWindowState) => state.selection.value),
//     getSelectionParams: createSelector(
//         [getMainCanvasState],
//         (state: MainWindowState) => ({
//             ...state.selection.params,
//             curveValue: state.selection.params[CurveValueName[state.selection.params.curveType]]})),
//     getSelectionParamsConfig: createSelector(
//         [getMainCanvasState],
//         (state: MainWindowState) => state.selection.paramsConfig),
//
// };