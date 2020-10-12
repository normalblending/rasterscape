import {VideoParams, VideoValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";
import {EdgeMode, MirrorMode, SlitMode} from "./services";
import {StackType} from "./capture/pixels";

export const getVideoState = getFunctionState<VideoValue, VideoParams>(
    {}, {
        on: false,
        pause: false,
        changeFunctionId: null,
        slitMode: SlitMode.FRONT,
        cutOffset: 0,
        edgeMode: EdgeMode.ALL,
        stackType: StackType.Right,
        mirrorMode: MirrorMode.NO,
        stackSize: 1,
    });