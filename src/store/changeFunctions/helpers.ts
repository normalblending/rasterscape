import {ChangeFunctions} from "./reducer";
import {ECFType} from "./types";
import {sinChangeFunction, sinInitialParams, sinParamsConfig} from "./functions/sin";
import {loopChangeFunction, loopInitialParams, loopParamsConfig} from "./functions/loop";
import {
    xyParaboloidNumberChangeFunction,
    xyParaboloidInitialParams,
    xyParaboloidParamsConfig,
    xyParaboloidVideoChangeFunction
} from "./functions/xyParaboloid";
import {
    depthInitialParams,
    depthNumberChangeFunction,
    depthParamsConfig,
    depthVideoChangeFunction
} from "./functions/depth";
import {waveChangeFunction, waveInitialParams, waveParamsConfig} from "./functions/wave";
import {fxyChangeFunction, fxyInitialParams, fxyParamsConfig, fxyVideoChangeFunction} from "./functions/fxy";

const getId = (key: string, type: ECFType) => +key.slice(type.toString().length);

export const cfId = (type: ECFType, state: ChangeFunctions) => {
    return type.toString() + (Object.keys(state).length
        ? (Math.max(0,
        ...Object
            .keys(state)
            .filter(key => state[key].type === type)
            .map(key => getId(key, state[key].type)))) + 1
        : 1);
};

const chInitialParams = {
    [ECFType.WAVE]: waveInitialParams,
    [ECFType.FXY]: fxyInitialParams,
    [ECFType.XY_PARABOLOID]: xyParaboloidInitialParams,
    [ECFType.DEPTH]: depthInitialParams,
};

const chParamsConfig = {
    [ECFType.WAVE]: waveParamsConfig,
    [ECFType.FXY]: fxyParamsConfig,
    [ECFType.XY_PARABOLOID]: xyParaboloidParamsConfig,
    [ECFType.DEPTH]: depthParamsConfig,
};

export const createCFInitialState = (id, type: ECFType) => {

    return {
        id,
        type,
        params: chInitialParams[type],
        paramsConfig: chParamsConfig[type]
    }
};

export const changeFunctionByType = {
    [ECFType.WAVE]: waveChangeFunction,
    [ECFType.FXY]: fxyChangeFunction,
    [ECFType.XY_PARABOLOID]: xyParaboloidNumberChangeFunction,
    [ECFType.DEPTH]: depthNumberChangeFunction,
    // [ECFType.SQ]:
    //     (params, range, pattern) =>
    //         (startValue, time, position) => {
    //             const {x: X, y: Y, c: C, xa, ya} = params;
    //             // console.log(params, range);
    //             const z = Math.pow(position.x - pattern.current.width / 2, 2) / xa / X + Math.pow(position.y - pattern.current.height / 2, 2) / ya / Y ;
    //             return z / pattern.current.width * (range[1] - range[0]) + startValue;
    //         },
};

export const videoChangeFunctionByType = {
    [ECFType.FXY]: fxyVideoChangeFunction,
    [ECFType.DEPTH]: depthVideoChangeFunction,
};
//({a, b, c, h}) => (x, y) => (Math.sin(x / a) * Math.cos(y / b) * c + h),