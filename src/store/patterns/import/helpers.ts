import {ImportParams, ImportValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getImportState = getFunctionState<ImportValue, ImportParams>(
    {}, {
        fit: false
    });