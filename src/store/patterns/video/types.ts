// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

import {FunctionState} from "../../../utils/patterns/function";
import {ECFType} from "../../changeFunctions/types";
import {ECompositeOperation} from "../../compositeOperations";
import {EdgeMode, MirrorMode, SlitMode, StackType} from "../_service/patternServices/PatternVideoService";

export interface VideoParams {
    cameraOn: boolean
    updatingOn: boolean
    changeFunctionId: string
    stackSize: number
    cutOffset: number
    slitMode: SlitMode
    edgeMode: EdgeMode
    stackType: StackType
    mirrorMode: MirrorMode
    device: MediaDeviceInfo
}

export interface VideoValue {

}

export type VideoState = FunctionState<VideoValue, VideoParams>;
