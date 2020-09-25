import {PatternAction} from "../pattern/types";
import {createRoom_s} from "./service";
import {base64ToImageData, imageDataToBase64} from "../../../utils/canvas/helpers/imageData";
import {ThunkResult} from "../../../utils/actions/types";
import {AppState} from "../../index";
import {updateImage} from "../pattern/actions";
import {stop} from "../video/actions";

export enum ERoomAction {
    CREATE_ROOM = "pattern/create-room",
    LEAVE_ROOM = "pattern/leave-room",
    IMAGE_SENT = "pattern/room/image-sent",
    MESSAGE_SENT = "pattern/room/message-sent",
    RECEIVE_MESSAGE = "pattern/room/receive-message",
    RESET_UNREADED = "pattern/room/reset-unreaded",
    RECEIVE_DRAWER = "pattern/room/receive-drawer",
    RECEIVE_MEMBERS = "pattern/room/receive-members",
    SET_DRAWER = "pattern/room/set-drawer",
    UPDATE_PROPS = "pattern/room/update-props",
}

export interface CreateRoomAction extends PatternAction {
    roomName: string
    socket: any
}

export interface ReceiveMessageAction extends PatternAction {
    message: string
    isMine: boolean
}

export interface ReceiveDrawerAction extends PatternAction {
    drawer: string
    meDrawer: boolean
}

export interface ReceiveMembersAction extends PatternAction {
    members: number
}

export const createRoom = (id: string, roomName: string): ThunkResult<CreateRoomAction, AppState> =>
    dispatch => {
        const socket = createRoom_s(roomName);

        socket.on("image", base64 => {
            base64ToImageData(base64).then(imageData => {
                dispatch(updateImage({id, imageData, emit: false}));
            });
        });

        socket.on("message", (message, isMine) => {
            console.log(isMine ? 'МОЁ' : 'NO');
            dispatch(receiveMessage(id, message, isMine));
        });

        socket.on("drawer", drawer => {
            dispatch(receiveDrawer(id, drawer));
        });

        socket.on("members", drawer => {
            dispatch(receiveMembers(id, drawer));
        });

        return dispatch({type: ERoomAction.CREATE_ROOM, id, roomName, socket})
    };

export const leaveRoom = (id: string): ThunkResult<PatternAction, AppState> =>
    (dispatch, getState) => {
        const socket = getState().patterns[id]?.room?.value?.socket;

        if (!socket) return;

        socket.close();

        return dispatch({type: ERoomAction.LEAVE_ROOM, id})
    };


export const sendImage = (id: string): ThunkResult<PatternAction, AppState> =>
    (dispatch, getState) => {
        const state = getState();
        const socket = state.patterns[id]?.room?.value?.socket;
        const resultImageData = state.patterns[id]?.current?.imageData;
        if (socket) {
            socket.emit("image", imageDataToBase64(resultImageData));

            return dispatch({type: ERoomAction.IMAGE_SENT, id})
        }
    };

export const sendMessage = (id: string, message: string): ThunkResult<PatternAction, AppState> =>
    (dispatch, getState) => {
        const socket = getState().patterns[id].room?.value?.socket;

        socket && socket.emit("message", message);

        return dispatch({type: ERoomAction.MESSAGE_SENT, id})
    };

export const setDrawer = (id: string): ThunkResult<PatternAction, AppState> =>
    (dispatch, getState) => {
        const socket = getState().patterns[id].room?.value?.socket;

        socket && socket.emit("drawer", socket.id);

        return dispatch({type: ERoomAction.SET_DRAWER, id})
    };

export const receiveMessage = (id: string, message: string, isMine: boolean): ReceiveMessageAction => ({
    type: ERoomAction.RECEIVE_MESSAGE,
    message,
    isMine,
    id,
})
export const resetUnreaded = (id: string): PatternAction => ({type: ERoomAction.RESET_UNREADED, id});

export const receiveDrawer = (id: string, drawer: string) =>
    (dispatch, getState) => {
        const socketId = getState().patterns[id].room?.value?.socket?.id;
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