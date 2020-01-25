import {CreateRoomAction, ERoomAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const roomReducers = {
    [ERoomAction.CREATE_ROOM]: reducePattern<CreateRoomAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            connected: action.roomName,
            socket: action.socket,
        }))
};