import {EToolType, SetCurrentToolAction} from "./types";
import {AppState, patternsService} from "../index";

export enum EToolAction {
    SET_CURRENT = "tools/set-current"
}

export const setCurrentTool = (tool: EToolType) => (dispatch, getState: () => AppState) => {
    const state = getState();
    const toolType = {
        [EToolType.Brush]: state.brush.params.brushType,
        [EToolType.Line]: state.line.params.type,
    }[tool]

    patternsService.bindTool(tool, toolType);

    dispatch({type: EToolAction.SET_CURRENT, tool});
}
