import {PatternAction} from "../pattern/types";
import {createRoom_s} from "./service";
import {base64ToImageData} from "../../../utils/canvas/helpers/imageData";
import {ThunkResult} from "../../../utils/actions/types";
import {AppState} from "../../index";
import {updateImage} from "../pattern/actions";

export enum ERoomAction {
    CREATE_ROOM = "pattern/create-room",
}

export interface CreateRoomAction extends PatternAction {
    roomName: string
    socket: any
}

export const createRoom = (id: string, roomName: string): ThunkResult<CreateRoomAction, AppState> =>
    dispatch => {
        const socket = createRoom_s(roomName);

        socket.on("image", base64 => {
            base64ToImageData(base64).then(imageData => {
                dispatch(updateImage(id, imageData, false));
            });
        });

        return dispatch({type: ERoomAction.CREATE_ROOM, id, roomName, socket})
    };