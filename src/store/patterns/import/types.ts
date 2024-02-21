// IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT IMPORT

import {FunctionState} from "../../../utils/patterns/function";

export interface ImportParams {
    fit: boolean
}

export interface ImportValue {

}

export type ImportState = FunctionState<ImportValue, ImportParams>;