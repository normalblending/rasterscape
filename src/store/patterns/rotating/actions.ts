import {PatternAction} from "../pattern/types";
import {RotationValue} from "./types";

export enum ERotationAction {
    SET_ROTATION = "pattern/set-rotation",
}

export interface SetRotationAction extends PatternAction {
    rotation: RotationValue
}

export const setRotation = (id: string, rotation: RotationValue): SetRotationAction =>
    ({type: ERotationAction.SET_ROTATION, id, rotation});