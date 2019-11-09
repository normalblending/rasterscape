import {EBrushType, SetOpacityAction, SetSizeAction, SetTypeAction} from "./types";

export enum EBrushAction {
    SET_SIZE = "brush/set-size",
    SET_OPACITY = "brush/set-opacity",
    SET_TYPE = "brush/set-type",
}

export const setSize = (size: number): SetSizeAction =>
    ({type: EBrushAction.SET_SIZE, size});

export const setOpacity = (opacity: number): SetOpacityAction =>
    ({type: EBrushAction.SET_OPACITY, opacity});

export const setType = (brushType: EBrushType): SetTypeAction =>
    ({type: EBrushAction.SET_TYPE, brushType});