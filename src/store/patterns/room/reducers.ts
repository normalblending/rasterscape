import {
    CreateRoomAction,
    ReceiveDrawerAction,
    ReceiveMembersAction,
    ReceiveMessageAction,
    SendMessageAction,
    SetDrawerAction
} from "./actions";
import {PatternAction, PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {MessageType} from "./types";
import {messageFilterByType} from "./helpers";
import {ERoomAction} from "./consts";

export const roomReducers = {
    [ERoomAction.CREATE_ROOM]: reducePattern<CreateRoomAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    connected: action.roomName,
                    // socket: action.socket,
                    persistentMessagePart: '>',
                }
            }
        })),
    [ERoomAction.SET_DRAWER]: reducePattern<SetDrawerAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    persistMeDrawer: action.persist,
                }
            }
        })),
    [ERoomAction.MESSAGE_SENT]: reducePattern<SendMessageAction>(
        (pattern: PatternState, action) => {
            return {
                ...pattern,
                room: {
                    ...pattern.room,
                    value: {
                        ...pattern.room.value,
                        persistentMessagePart: action.leftPersistent,
                    }
                }
            }
        }
    ),
    [ERoomAction.LEAVE_ROOM]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: null
            }
        })),
    [ERoomAction.RECEIVE_MESSAGE]: reducePattern<ReceiveMessageAction>(
        (pattern: PatternState, action) => {
            const newMessage = {
                data: action.message,
                unreaded: !action.isMine,
            };

            const singletonTypes = Object.keys(messageFilterByType);

            const oldMessages = singletonTypes.includes(action.message.type) ? (pattern.room?.value?.messages || []).filter((message) => {
                return !messageFilterByType[action.message.type]?.(action.message, message.data);
            }) : (pattern.room?.value?.messages || []);

            return {
                ...pattern,
                room: {
                    ...pattern.room,
                    value: {
                        ...pattern.room.value,
                        messages: [...oldMessages, newMessage].slice(-44),
                        unreaded: true,
                    },
                }
            }
        }),
    [ERoomAction.RESET_UNREADED]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            room: {
                ...pattern.room,
                value: {
                    ...pattern.room.value,
                    messages: pattern.room?.value?.messages.map(message => ({
                        ...message,
                        unreaded: false
                    })),
                    unreaded: false,
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