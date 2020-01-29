import {EImportAction, SetImportParamsAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const importReducers = {
    [EImportAction.SET_IMPORT_PARAMS]: reducePattern<SetImportParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            import: {
                ...pattern.import,
                params: {
                    ...pattern.import.params,
                    ...action.value
                }
            }
        })),

};