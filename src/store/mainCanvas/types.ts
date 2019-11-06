import {Action} from "redux";
import {SelectionValue} from "../../utils/types";
import {ESelectionMode} from "../../components/_shared/CanvasSelector";

export interface ImageAction extends Action {
    imageData: ImageData
}

export interface UpdateMainImageAction extends ImageAction {
}

export interface SetWidthAction extends Action {
    width: number
}

export interface SetHeightAction extends Action {
    height: number
}

export interface SetSelectionAction extends Action {
    selection: SelectionValue
}

export interface SetSelectionModeAction extends Action {
    mode: ESelectionMode
}

export interface SetSelectionParamsAction extends Action {
    params: object
}