// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

import {FunctionState} from "../../../utils/patterns/function";
import {ECFType} from "../../changeFunctions/types";
import {EdgeMode, MirrorMode, SlitMode} from "./services";
import {StackType} from "./_old/capture/pixels";
import {ECompositeOperation} from "../../compositeOperations";

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
