import {Room} from "./reducer";
import {ConnectRoomsAction, UpdateRoomsAction} from "./types";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../index";
import {Action} from "redux";
import {connectRooms} from "./service";

type ThunkResult<R> = ThunkAction<R, AppState, undefined, Action>;
export enum ERoomsAction {
    UPDATE_ROOMS = "rooms/update",
    CONNECT_ROOMS = "rooms/connect",
}

export const updateRooms = (rooms: Room[]): UpdateRoomsAction => ({
    type: ERoomsAction.UPDATE_ROOMS,
    rooms
});

export const roomsConnect = (): ThunkResult<ConnectRoomsAction> =>
    dispatch => {

        const socket = connectRooms();

        socket.on("updateRooms", (rooms) => {
            dispatch(updateRooms(Object.values(rooms)))
        });
        return dispatch({type: ERoomsAction.CONNECT_ROOMS});
    };