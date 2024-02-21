// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

import {FunctionState} from "../../../utils/patterns/function";
import {ECFType} from "../../changeFunctions/types";
import {ECompositeOperation} from "../../compositeOperations";
import {
    EdgeMode,
    MirrorMode,
    CameraAxis,
    StackType,
} from '../_service/patternServices/PatternVideoService/ShaderVideoModule'
import { VideoOffset } from '../_service/patternServices/PatternVideoService/ShaderVideoModule/types'

export interface VideoParams {
    cameraOn: boolean
    updatingOn: boolean
    changeFunctionId: string
    stackSize: number
    offset: VideoOffset
    cameraAxis: CameraAxis
    edgeMode: EdgeMode
    stackType: StackType
    mirrorMode: MirrorMode
    device: MediaDeviceInfo
}

export interface VideoValue {

}

export type VideoState = FunctionState<VideoValue, VideoParams>;
