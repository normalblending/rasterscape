import {VideoParams, VideoValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";
import {EdgeMode, SlitMode} from "./services";
import {StackType} from "./capture/pixels";

export const getVideoState = getFunctionState<VideoValue, VideoParams>(
    {}, {
        on: false,
        changeFunctionId: null,
        slitMode: SlitMode.FRONT,
        edgeMode: EdgeMode.ALL,
        stackType: StackType.Right,
    });