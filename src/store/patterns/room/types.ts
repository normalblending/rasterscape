import {FunctionState} from "../../../utils/patterns/function";

export interface RoomParams {
}

export interface RoomValue {
    connected?: string
    socket?: any
    messages?: string[]
    drawer?: string
    meDrawer?: boolean
}

export type RoomState = FunctionState<RoomValue, RoomParams>;