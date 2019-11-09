import {Action} from "redux";
import {SelectionValue} from "../../../utils/types";

export interface ImageAction extends Action {
    imageData: ImageData
}

export interface UpdateImageAction extends ImageAction {
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

export interface SetSelectionParamsAction extends Action {
    params: object
}