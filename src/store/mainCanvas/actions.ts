import {
    SetHeightAction,
    SetWidthAction,
    SetSelectionAction,
    SetSelectionModeAction,
    SetSelectionParamsAction
} from "./types";
import {SelectionValue} from "../../utils/types";
import {ESelectionMode} from "../../components/_shared/CanvasSelector";

export enum EMainCanvasAction {
    UPDATE_IMAGE = "main-canvas/update-image",
    UNDO = "main-canvas/undo",
    REDO = "main-canvas/redo",
    STORE_IMAGE = "main-canvas/store-image",
    UNSTORE_IMAGE = "main-canvas/unstore-image",
    SET_WIDTH = "main-canvas/set-width",
    SET_HEIGHT = "main-canvas/set-height",
    SET_SELECTION = "main-canvas/set-selection",
    SET_SELECTION_PARAMS = "main-canvas/set-selection-params",
}

export const updateImage = (imageData: ImageData) => ({type: EMainCanvasAction.UPDATE_IMAGE, imageData});
export const undo = () => ({type: EMainCanvasAction.UNDO});
export const redo = () => ({type: EMainCanvasAction.REDO});
export const storeImage = () => ({type: EMainCanvasAction.STORE_IMAGE});
export const unstoreImage = () => ({type: EMainCanvasAction.UNSTORE_IMAGE});
export const setWidth = (width: number): SetWidthAction => ({type: EMainCanvasAction.SET_WIDTH, width});
export const setHeight = (height: number): SetHeightAction => ({type: EMainCanvasAction.SET_HEIGHT, height});
export const setSelection = (selection: SelectionValue): SetSelectionAction =>
    ({type: EMainCanvasAction.SET_SELECTION, selection});
export const setSelectionParams = (params: object): SetSelectionParamsAction =>
    ({type: EMainCanvasAction.SET_SELECTION_PARAMS, params});