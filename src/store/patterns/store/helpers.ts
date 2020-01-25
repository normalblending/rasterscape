import {CanvasState} from "../../../utils/canvas/types";
import {StoreParams} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getStoreState = getFunctionState<CanvasState, StoreParams>(null, {});