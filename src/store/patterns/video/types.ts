// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

import {FunctionState} from "../../../utils/patterns/function";
import {ECFType} from "../../changeFunctions/types";

export interface VideoParams {
    on: boolean
    changeFunctionId: ECFType
}

export interface VideoValue {

}

export type VideoState = FunctionState<VideoValue, VideoParams>;