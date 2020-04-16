import {CreateRoomAction, ERoomAction} from "./actions";
import {PatternAction, PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const roomReducers = {
    [ERoomAction.CREATE_ROOM]: reducePattern<CreateRoomAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    connected: action.roomName,
                    socket: action.socket,
                }
            }
        })),
    [ERoomAction.LEAVE_ROOM]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: null
            }
        }))
};