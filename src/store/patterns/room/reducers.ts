import {
    CreateRoomAction,
    ERoomAction,
    ReceiveDrawerAction,
    ReceiveMembersAction,
    ReceiveMessageAction
} from "./actions";
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
                    messages: pattern.room?.value?.messages
                        ? [...pattern.room.value.messages, action.message].slice(-69)
                        : [action.message],
                    unreaded: (pattern.room?.value?.unreaded || 0) + (action.isMine ? 0 : 1),
                },
            }
        })),
    [ERoomAction.RESET_UNREADED]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    unreaded: 0,
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
        })),
    [ERoomAction.RECEIVE_MEMBERS]: reducePattern<ReceiveMembersAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    members: action.members,
                },
            }
        }))
};