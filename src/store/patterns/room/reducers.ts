import {CreateRoomAction, ERoomAction, ReceiveDrawerAction, ReceiveMessageAction} from "./actions";
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
        })),
    [ERoomAction.RECEIVE_MESSAGE]: reducePattern<ReceiveMessageAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    messages: pattern.room.value.messages
                        ? [...pattern.room.value.messages, action.message].slice(-69)
                        : [action.message]
                },
            }
        })),
    [ERoomAction.RECEIVE_DRAWER]: reducePattern<ReceiveDrawerAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    drawer: action.drawer,
                    meDrawer: action.meDrawer,
                },
            }
        }))
};