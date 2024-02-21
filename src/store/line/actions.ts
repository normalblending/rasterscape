import {ELineType, LineParams, SetLineParamsAction} from "./types";
import {AppState, patternsService} from "../index";
import {EToolType} from "../tool/types";
import {coordHelper5} from "../../components/Area/canvasPosition.servise";

export enum ELineAction {
    SET_PARAMS = "line/set-params",
    SET_TYPE = "line/set-type",
}

export const setLineParams = (params: LineParams) => (dispatch) => {

    dispatch({type: ELineAction.SET_PARAMS, params});
}


export const setLineType = (lineType: ELineType) => (dispatch, getState: () => AppState) => {

    // coordHelper5.setText('set bind tool');


    patternsService.bindTool(EToolType.Line, lineType);// надо вынести в отдельный экшен
    dispatch({type: ELineAction.SET_TYPE, lineType });
}
