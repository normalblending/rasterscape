import {handleActions} from "redux-actions";
import {ERoomsAction} from "./actions";
import {UpdateRoomsAction} from "./types";

export interface Room {
    name: string
}

export interface RoomsState {
    rooms: Room[]
}

export const roomsReducer = handleActions<RoomsState>({
    [ERoomsAction.UPDATE_ROOMS]: (state: RoomsState, action: UpdateRoomsAction) => ({
        rooms: action.rooms
    })
}, {
    rooms: []
});
