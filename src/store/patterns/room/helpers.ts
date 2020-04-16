import {RoomParams, RoomValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRoomState = getFunctionState<RoomValue, RoomParams>(
    {}, {
        value: null
    });