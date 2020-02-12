import {VideoParams, VideoValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getVideoState = getFunctionState<VideoValue, VideoParams>(
    {}, {
        on: false,
        changeFunctionId: null
    });