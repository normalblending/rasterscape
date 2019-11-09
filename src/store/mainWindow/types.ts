import {
    SetHeightAction,
    SetSelectionAction,
    SetSelectionParamsAction,
    SetWidthAction,
    UpdateImageAction,
} from "../_shared/window/types";

export interface UpdateMainImageAction extends UpdateImageAction {
}

export interface SetMainWindowWidthAction extends SetWidthAction {
}

export interface SetMainWindowHeightAction extends SetHeightAction {
}

export interface SetMainWindowSelectionAction extends SetSelectionAction {
}

export interface SetMainWindowSelectionParamsAction extends SetSelectionParamsAction {
}