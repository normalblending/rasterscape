import {ChangeFunctionsState} from "./reducer";
import {ECFType} from "./types";
import {sinChangeFunction, sinInitialParams, sinParamsConfig} from "./functions/sin";
import {loopChangeFunction, loopInitialParams, loopParamsConfig} from "./functions/loop";
import {xyChangeFunction, xyInitialParams, xyParamsConfig} from "./functions/xy";

const getId = (key: string, type: ECFType) => +key.slice(type.toString().length);

export const cfId = (type: ECFType, state: ChangeFunctionsState) => {
    return type.toString() + (Object.keys(state).length
        ? (Math.max(0,
        ...Object
            .keys(state)
            .filter(key => state[key].type === type)
            .map(key => getId(key, state[key].type)))) + 1
        : 1);
};

const chInitialParams = {
    [ECFType.SIN]: sinInitialParams,
    [ECFType.LOOP]: loopInitialParams,
    [ECFType.XY]: xyInitialParams
};

const chParamsConfig = {
    [ECFType.SIN]: sinParamsConfig,
    [ECFType.LOOP]: loopParamsConfig,
    [ECFType.XY]: xyParamsConfig
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
    [ECFType.SIN]: sinChangeFunction,
    [ECFType.LOOP]: loopChangeFunction,
    [ECFType.XY]: xyChangeFunction,
    // [ECFType.SQ]:
    //     (params, range, pattern) =>
    //         (startValue, time, position) => {
    //             const {x: X, y: Y, c: C, xa, ya} = params;
    //             // console.log(params, range);
    //             const z = Math.pow(position.x - pattern.current.width / 2, 2) / xa / X + Math.pow(position.y - pattern.current.height / 2, 2) / ya / Y ;
    //             return z / pattern.current.width * (range[1] - range[0]) + startValue;
    //         },
};
//({a, b, c, h}) => (x, y) => (Math.sin(x / a) * Math.cos(y / b) * c + h),