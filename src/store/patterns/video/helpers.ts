import {VideoParams, VideoValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";
import {EdgeMode, MirrorMode, SlitMode} from "./services";
import {StackType} from "./_old/capture/pixels";

export const getVideoState = getFunctionState<VideoValue, VideoParams>(
    {}, {
        cameraOn: false,
        updatingOn: false,
        on: false,
        pause: false,
        changeFunctionId: null,
        slitMode: SlitMode.FRONT,
        cutOffset: 0,
        edgeMode: EdgeMode.ALL,
        stackType: StackType.Right,
        mirrorMode: MirrorMode.NO,
        stackSize: 1,
        device: null
    });
