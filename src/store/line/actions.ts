import {ELineType, SetOpacityAction, SetSizeAction, SetTypeAction} from "./types";

export enum ELineAction {
    SET_SIZE = "line/set-size",
    SET_OPACITY = "line/set-opacity",
    SET_TYPE = "line/set-type",
}

export const setSize = (size: number): SetSizeAction =>
    ({type: ELineAction.SET_SIZE, size});

export const setOpacity = (opacity: number): SetOpacityAction =>
    ({type: ELineAction.SET_OPACITY, opacity});

export const setType = (lineType: ELineType): SetTypeAction =>
    ({type: ELineAction.SET_TYPE, lineType});