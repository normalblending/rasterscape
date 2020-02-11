import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState} from "../../index";
import {Capture} from "./capture";
import {Formulas} from "./capture/formulas";
import {get, PixelsStack, set} from "./capture/pixels";
import 'p5/lib/addons/p5.dom';
import {EdgeMode} from "./capture/types";
import {updateImage} from "../pattern/actions";

export enum EVideoAction {
    SET_VIDEO_PARAMS = 'pattern/video/set-video-param'

}

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}

export const onNewFrame = (id: string, imageData: ImageData) => (dispatch, getState: () => AppState) => {

    dispatch(updateImage(id,imageData));

};

export const setVideoParams = (id: string, value: VideoParams) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_VIDEO_PARAMS,
        id,
        value
    })
};

