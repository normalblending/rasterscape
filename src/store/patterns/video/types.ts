// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

import {FunctionState} from "../../../utils/patterns/function";
import {ECFType} from "../../changeFunctions/types";
import {EdgeMode, SlitMode} from "./services";
import {StackType} from "./capture/pixels";
import {ECompositeOperation} from "../../compositeOperations";

export interface VideoParams {
    on: boolean
    changeFunctionId: ECFType
    slitMode: SlitMode
    edgeMode: EdgeMode
    stackType: StackType
}

export interface VideoValue {

}

export type VideoState = FunctionState<VideoValue, VideoParams>;