import {PatternAction} from "../pattern/types";
import {ImportParams} from "./types";
import {imageToImageData} from "../../../utils/canvas/helpers/imageData";
import {AppState} from "../../index";
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
export const load = (id: string, image) => (dispatch, getState) => {

    const imageData = imageToImageData(image);

    const state: AppState = getState();

    const isFit = state.patterns[id].import.params.fit;

    if (isFit) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }


        const oldWidth = state.patterns[id].current.imageData.width;
        const oldHeight = state.patterns[id].current.imageData.height;

        canvas.width = oldWidth;
        canvas.height = oldHeight;

        ctx.drawImage(image, 0, 0, oldWidth, oldHeight);


        const imageData2 = ctx.getImageData(0, 0, oldWidth, oldHeight);
        dispatch(updateImage({id, imageData: imageData2}));

    } else {

        dispatch(updateImage({id, imageData}));
    }


    dispatch({type: EImportAction.LOAD, id, imageData});
};
export const save = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }


    canvas.width = state.patterns[id].current.imageData.width;
    canvas.height = state.patterns[id].current.imageData.height;

    ctx.putImageData(state.patterns[id].current.imageData, 0, 0);


    var dataURL = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    document.body.appendChild(link); // Firefox requires the link to be in the body :(
    link.href = dataURL;
    link.download = `${dateZs()}.png`;
    link.click();
    document.body.removeChild(link);


    dispatch({type: EImportAction.SAVE, id});
};