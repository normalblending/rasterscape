import {createSelector} from "reselect";
import {WindowState} from "../../mainCanvas/reducer";
import {CurveValueName} from "../../../components/_shared/CanvasSelector";
import {AppState} from "../../index";

export const CanvasSelectors = {

};

export const windowSelectors = (getWindowState: (state: AppState) => WindowState) => ({
    getWindowState,
    getImageValue: createSelector(
        [getWindowState],
        (window: WindowState) => window.current.imageData),
    getSelectionValue: createSelector(
        [getWindowState],
        (window: WindowState) => window.selection.value),
    getSelectionParams: createSelector(
        [getWindowState],
        (window: WindowState) => window.selection.params),
    getSelectionParamsConfig: createSelector(
        [getWindowState],
        (window: WindowState) => window.selection.paramsConfig),
    getSize: createSelector(
        [getWindowState],
        (window: WindowState) => ({width: window.current.width, height: window.current.height})),

});