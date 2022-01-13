import {PatternAction} from "../pattern/types";
import {sendImage} from "../room/actions";
import {AppState} from "../../index";
import {isMeDrawer} from "../room/helpers";
import {HistoryState} from "./types";
import {historyInit, historyPush, historyRedo, historyUndo} from "./helpers";
import {patternsService} from "../../index";
import {imageDataDebug} from "../../../components/Area/canvasPosition.servise";

export enum EHistoryAction {
    SET_HISTORY = "pattern/history/set",
}

export interface PatternSetHistoryAction extends PatternAction {
    history: HistoryState
}

export const initHistory = (id: string) => (dispatch, getState: () => AppState) => {

    const pattern = getState().patterns[id];
    const patternService = patternsService.pattern[id];

    const newHistory = historyInit(pattern.history, {
        canvasImageData: patternService.canvasService.getImageData(),
        maskImageData: patternService.maskService.getImageData()
    });

    dispatch({type: EHistoryAction.SET_HISTORY, id, history: newHistory});
};
export const pushHistory = (id: string) => (dispatch, getState: () => AppState) => {

    const pattern = getState().patterns[id];
    const patternService = patternsService.pattern[id];

    const newHistory = historyPush(pattern.history, {
        canvasImageData: patternService.canvasService.getImageData(),
        maskImageData: patternService.maskService.getImageData()
    });

    dispatch({type: EHistoryAction.SET_HISTORY, id, history: newHistory});
};

export const undo = (id: string) => (dispatch, getState: () => AppState) => {

    const pattern = getState().patterns[id];
    const patternService = patternsService.pattern[id];

    if (!isMeDrawer(pattern.room?.value)) {
        return
    } //надо задизейблить кнопку просто

    const history = historyUndo(pattern.history, {
        canvasImageData: patternService.canvasService.getImageData(),
        maskImageData: patternService.maskService.getImageData()
    });

    if (!history) {
        return;
    }

    dispatch({type: EHistoryAction.SET_HISTORY, id, history});

    patternService
        .setCanvasAndMaskImageData(history.value.current.canvasImageData, history.value.current.maskImageData);

    dispatch(sendImage(id));

}
export const redo = (id: string) => (dispatch, getState) => {

    const pattern = getState().patterns[id];
    const patternService = patternsService.pattern[id];

    if (!isMeDrawer(pattern.room?.value)) {
        return
    }

    const history = historyRedo(pattern.history, {
        canvasImageData: patternService.canvasService.getImageData(),
        maskImageData: patternService.maskService.getImageData()
    });

    if (!history) {
        return;
    }

    dispatch({type: EHistoryAction.SET_HISTORY, id, history});

    patternService
        .setCanvasAndMaskImageData(history.value.current.canvasImageData, history.value.current.maskImageData);

    dispatch(sendImage(id));
};
