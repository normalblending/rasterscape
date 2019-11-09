import {
    SetMainWindowHeightAction,
    SetMainWindowWidthAction,
    SetMainWindowSelectionAction,
    SetMainWindowSelectionParamsAction
} from "./types";
import {SelectionValue} from "../../utils/types";

export enum EMainWindowAction {
    UPDATE_IMAGE = "main-window/update-image",
    UNDO = "main-window/undo",
    REDO = "main-window/redo",
    STORE_IMAGE = "main-window/store-image",
    UNSTORE_IMAGE = "main-window/unstore-image",
    SET_WIDTH = "main-window/set-width",
    SET_HEIGHT = "main-window/set-height",
    SET_SELECTION = "main-window/set-selection",
    SET_SELECTION_PARAMS = "main-window/set-selection-params",
}

export const updateImage = (imageData: ImageData) => ({type: EMainWindowAction.UPDATE_IMAGE, imageData});
export const undo = () => ({type: EMainWindowAction.UNDO});
export const redo = () => ({type: EMainWindowAction.REDO});
export const storeImage = () => ({type: EMainWindowAction.STORE_IMAGE});
export const unstoreImage = () => ({type: EMainWindowAction.UNSTORE_IMAGE});
export const setWidth = (width: number): SetMainWindowWidthAction => ({type: EMainWindowAction.SET_WIDTH, width});
export const setHeight = (height: number): SetMainWindowHeightAction => ({type: EMainWindowAction.SET_HEIGHT, height});
export const setSelection = (selection: SelectionValue): SetMainWindowSelectionAction =>
    ({type: EMainWindowAction.SET_SELECTION, selection});
export const setSelectionParams = (params: object): SetMainWindowSelectionParamsAction =>
    ({type: EMainWindowAction.SET_SELECTION_PARAMS, params});