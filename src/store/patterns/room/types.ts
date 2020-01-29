import {FunctionState} from "../../../utils/patterns/function";

export interface RoomParams {
}

export interface RoomValue {
    connected?: string
    socket?: any
}

export type RoomState = FunctionState<RoomValue, RoomParams>;