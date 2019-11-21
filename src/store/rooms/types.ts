import {Action} from "redux";
import {Room} from "./reducer";

export interface UpdateRoomsAction extends Action {
    rooms: Room[]
}
export interface ConnectRoomsAction extends Action {
}