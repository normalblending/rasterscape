import {EParamType} from "../../components/_shared/Params";
import {ChangeFunctionsState} from "./reducer";
import {ECFType} from "./types";
import {ValueD} from "../../components/_shared/ButtonNumber";


const getId = (key: string, type: ECFType) => +key.slice(type.toString().length);

export const cfId = (type: ECFType, state: ChangeFunctionsState) => {
    return type.toString() + (Object.keys(state).length
        ? (Math.max(
        ...Object
            .keys(state)
            .filter(key => state[key].type === type)
            .map(key => getId(key, state[key].type)))) + 1
        : 1);
};

const chInitialParams = {
    [ECFType.SIN]: {
        a: 0.3,
        t: 300,
        p: 0,
    }
};

const chParamsConfig = {
    [ECFType.SIN]: [{
        name: "a",
        type: EParamType.Number,
        props: {
            range: [0, 1] as [number, number]
        }
    }, {
        name: "t",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(0.1),
            range: [1, 1000] as [number, number]
        }
    }, {
        name: "p",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(0.5),
            range: [1, 1500] as [number, number]
        }
    }]
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
    [ECFType.SIN]: (params, range) => (startValue, time) => startValue + params.a * (range[1] - range[0]) * Math.sin(time / params.t)
};