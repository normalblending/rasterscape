import {PatternAction} from "../pattern/types";
import {sendImage} from "../room/actions";
import {AppState} from "../../index";
import {isMeDrawer} from "../room/helpers";
import {updateSelectionImage} from "../selection/actions";


export enum EHistoryAction {
    UNDO = "pattern/undo",
    REDO = "pattern/redo",
}

export interface PatternUndoAction extends PatternAction {
}

export interface PatternRedoAction extends PatternAction {
}

export const undo = (id: string) => (dispatch, getState) => {

    if (!isMeDrawer(getState().patterns[id].room?.value)) {
        return
    }

    dispatch({type: EHistoryAction.UNDO, id});

    dispatch(sendImage(id));

    //обновление изображения выделения
    dispatch(updateSelectionImage(id));
}
export const redo = (id: string) => (dispatch, getState) => {
    if (!isMeDrawer(getState().patterns[id].room?.value)) {
        return
    }

    dispatch({type: EHistoryAction.REDO, id});

    dispatch(sendImage(id));

    //обновление изображения выделения
    dispatch(updateSelectionImage(id));
};
