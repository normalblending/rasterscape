import {EToolType, SetCurrentToolAction} from "./types";

export enum EToolAction {
    SET_CURRENT = "tools/set-current"
}

export const setCurrentTool = (tool: EToolType): SetCurrentToolAction =>
    ({type: EToolAction.SET_CURRENT, tool});
