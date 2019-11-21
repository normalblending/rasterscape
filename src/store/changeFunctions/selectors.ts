import {createSelector} from "reselect";
import {changeFunctionByType} from "./helpers";
import {ChangeFunctionsState} from "./reducer";

const getCFState = state => state.changeFunctions;




export const getChangeFById = createSelector(
    [getCFState],
    (cfs: ChangeFunctionsState, id) => changeFunctionByType[cfs[id].type]
);