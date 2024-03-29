import {PatternAction} from "../pattern/types";
import {ImportParams} from "./types";
import {imageToImageData} from "../../../utils/canvas/helpers/imageData";
import {AppState, patternsService} from "../../index";
import {dateZs} from "../../../utils/utils";
import {updateImage} from "../pattern/actions";

export enum EImportAction {
    SET_IMPORT_PARAMS = "pattern/set-import-params",
    LOAD = "pattern/load",
    SAVE = "pattern/save",
}

export interface SetImportParamsAction extends PatternAction {
    value: ImportParams
}

export interface ImportAction extends PatternAction {
}

export interface SaveAction extends PatternAction {
}

export const setImportParams = (id: string, value: ImportParams): SetImportParamsAction =>
    ({type: EImportAction.SET_IMPORT_PARAMS, id, value});
export const load = (id: string, image: HTMLImageElement) => (dispatch, getState) => {

    const imageData = imageToImageData(image);

    const state: AppState = getState();
    const pattern = state.patterns[id];
    const patternService = patternsService.pattern[id];

    if (!pattern) {
        return
    }

    const isFit = pattern.import?.params?.fit;
    const meDrawer = !pattern.room?.value?.connected || pattern.room?.value?.meDrawer;

    if (!meDrawer) {
        return
    }

    if (isFit) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }


        const oldWidth = state.patterns[id].width;
        const oldHeight = state.patterns[id].height;

        canvas.width = oldWidth;
        canvas.height = oldHeight;

        ctx.drawImage(image, 0, 0, oldWidth, oldHeight);


        const imageData2 = ctx.getImageData(0, 0, oldWidth, oldHeight);

        patternService.setCanvasImageData(imageData2);

        dispatch(updateImage({id}));

    } else {

        patternService.setCanvasImageData(imageData);
        dispatch(updateImage({id}));
    }


    // dispatch({type: EImportAction.LOAD, id, imageData});  // редьюсера нету
};
export const save = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];
    const patternService = patternsService.pattern[id];

    if (!pattern) {
        return null;
    }

    var dataURL = patternService.canvasService.canvas.toDataURL("image/png");
    var link = document.createElement("a");
    document.body.appendChild(link); // Firefox requires the link to be in the body :(
    link.href = dataURL;
    link.download = `${dateZs()}.png`;
    link.click();
    document.body.removeChild(link);


    dispatch({type: EImportAction.SAVE, id});
};
