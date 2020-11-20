import {PatternAction} from "../pattern/types";
import {createRoomSocket, roomSockets} from "./service";
import {base64ToImageData, imageDataToBase64} from "../../../utils/canvas/helpers/imageData";
import {ThunkResult} from "../../../utils/actions/types";
import {AppState} from "../../index";
import {updateImage} from "../pattern/actions";
import {stop} from "../video/actions";
import _throttle from 'lodash/throttle';
import {getSignedMessage, isMeDrawer, parseMessage} from "./helpers";
import {MessageData} from "./types";

export enum ERoomAction {
    CREATE_ROOM = "pattern/create-room",
    LEAVE_ROOM = "pattern/leave-room",
    IMAGE_SENT = "pattern/room/image-sent",
    MESSAGE_SENT = "pattern/room/message-sent",
    RECEIVE_MESSAGE = "pattern/room/receive-message",
    RESET_UNREADED = "pattern/room/reset-unreaded",
    RECEIVE_DRAWER = "pattern/room/receive-drawer",
    RECEIVE_MEMBERS = "pattern/room/receive-members",
    RECEIVE_TOKEN = "pattern/room/receive-token",
    SET_DRAWER = "pattern/room/set-drawer",
    UPDATE_PROPS = "pattern/room/update-props",
}

export interface CreateRoomAction extends PatternAction {
    roomName: string
}

export interface SetDrawerAction extends PatternAction {
    persist: boolean
}

export interface SendMessageAction extends PatternAction {
    leftPersistent: string
    left: string
}

export interface ReceiveMessageAction extends PatternAction {
    message: MessageData
    isMine: boolean
}

export interface ReceiveDrawerAction extends PatternAction {
    drawer: string
    meDrawer: boolean
}

export interface ReceiveMembersAction extends PatternAction {
    members: number
}

export interface ReceiveTokenAction extends PatternAction {
    token: string
}

export const createRoom = (id: string, roomName: string): ThunkResult<CreateRoomAction, AppState> =>
    dispatch => {
        const roomSocket = createRoomSocket(roomName, {
            onImage: base64 => {
                base64ToImageData(base64).then(imageData => {
                    dispatch(updateImage({id, imageData, emit: false}));
                });
            },
            onMessage: (message, isMine) => {

                dispatch(receiveMessage(id, message, isMine));
            },
            onDrawer: drawer => {
                dispatch(receiveDrawer(id, drawer));
            },
            onMembers: members => {
                dispatch(receiveMembers(id, members));
            },
            onAuth: (token) => {
                dispatch(receiveToken(id, token));
            }
        });

        console.log(roomSocket);
        roomSockets.add(id, roomSocket);

        return dispatch({
            type: ERoomAction.CREATE_ROOM,
            id,
            roomName,
        })
    };

export const leaveRoom = (id: string): ThunkResult<PatternAction, AppState> =>
    (dispatch, getState) => {

        const roomSocket = roomSockets.get(id);

        if (!roomSocket) return;

        roomSockets.leave(id);

        return dispatch({
            type: ERoomAction.LEAVE_ROOM,
            id,
        })
    };

const sendImageThrottled = _throttle((id, dispatch, getState) => {
    const state = getState();
    const roomSocket = roomSockets.get(id);
    const resultImageData = state.patterns[id]?.current?.imageData;
    if (roomSocket) {
        roomSocket.image(imageDataToBase64(resultImageData));

        return dispatch({
            type: ERoomAction.IMAGE_SENT,
            id,
        })
    }
}, 0);

export const sendImage = (id: string): ThunkResult<void, AppState> =>
    (dispatch, getState) => {
        sendImageThrottled(id, dispatch, getState);
    };

export const sendMessage = (id: string, message: string): ThunkResult<SendMessageAction, AppState> =>
    (dispatch, getState) => {

        const state = getState();
        const roomSocket = roomSockets.get(id);
        const resultImageData = state.patterns[id]?.current?.imageData;

        const {left, right, leftPersistent, leftParts} = parseMessage(message);

        if (roomSocket) {
            roomSocket.message(
                right,
                left,
                leftParts[1] && imageDataToBase64(resultImageData)
            );

            return dispatch({
                type: ERoomAction.MESSAGE_SENT,
                id,
                leftPersistent,
                left
            });
        }
    };

export const setDrawer = (id: string, persist?: boolean): ThunkResult<SetDrawerAction, AppState> =>
    (dispatch, getState) => {
        const roomValue = getState().patterns[id].room?.value;

        const roomSocket = roomSockets.get(id);
        const meDrawer = isMeDrawer(roomValue);
        const persistMeDrawer = roomValue?.persistMeDrawer;

        let needToggle;

        // console.log(meDrawer, !persist, persistMeDrawer)

        if (meDrawer) {
            if (!persist) { // from border
                if (persistMeDrawer) {
                    needToggle = false;
                } else {
                    needToggle = true;
                }
            } else { // from button
                if (persistMeDrawer) {
                    needToggle = true;
                } else {
                    needToggle = true;
                }
            }
        } else {
            if (!persist) { // from border
                needToggle = true;
            } else { // from button
                needToggle = true;
            }
        }


        if (needToggle) {

            roomSocket?.drawer(roomSocket.socket.id);

            return dispatch({
                type: ERoomAction.SET_DRAWER,
                id,
                persist: meDrawer ? false : persist
            })
        }
    };

export const receiveMessage = (id: string, message: MessageData, isMine: boolean): ReceiveMessageAction => ({
    type: ERoomAction.RECEIVE_MESSAGE,
    message,
    isMine,
    id,
})
export const resetUnreaded = (id: string): PatternAction => ({type: ERoomAction.RESET_UNREADED, id});

export const receiveDrawer = (id: string, drawer: string) =>
    (dispatch, getState) => {
        const socketId = roomSockets.get(id)?.socket?.id;
        const meDrawer = socketId ? socketId === drawer : false;

        if (!meDrawer) {
            dispatch(stop(id));
        }

        return dispatch({
            type: ERoomAction.RECEIVE_DRAWER,
            drawer,
            meDrawer,
            id,
        })
    }

export const receiveMembers = (id: string, members: string): ReceiveMembersAction => ({
    type: ERoomAction.RECEIVE_MEMBERS,
    members: +members,
    id,
});

export const receiveToken = (id: string, token: string) => (dispatch, getState) => {

    roomSockets.get(id)?.setToken(token);

    // dispatch({
    //     type: ERoomAction.RECEIVE_TOKEN,
    //     token,
    //     id,
    // })
};