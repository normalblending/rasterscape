import {EParamType} from "../../components/_shared/Params";
import {ChangeFunctionsState} from "./reducer";
import {ECFType} from "./types";
import {ValueD} from "../../components/_shared/ButtonNumber";
import {coordHelper} from "../../components/Area/canvasPosition.servise";
import {start} from "repl";


const getId = (key: string, type: ECFType) => +key.slice(type.toString().length);

export const cfId = (type: ECFType, state: ChangeFunctionsState) => {
    console.log(
        Object
            .keys(state)
            .filter(key => state[key].type === type)
    );
    return type.toString() + (Object.keys(state).length
        ? (Math.max(0,
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
    },
    [ECFType.LOOP]: {
        start: 0,
        end: 1,
        t: 3000,
        p: 0,
    },
    [ECFType.XY]: {
        start: 0,
        end: 1,
        x: 150,
        y: 150,
        xa: 1,
        ya: 1
    }
};

const chParamsConfig = {
    [ECFType.SIN]: [{
        name: "a",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(100),
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
    }],
    [ECFType.LOOP]: [{
        name: "start",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(100),
            range: [0, 1] as [number, number]
        }
    }, {
        name: "end",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(100),
            range: [0, 1] as [number, number]
        }
    }, {
        name: "t",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(0.1),
            range: [-3000, 3000] as [number, number]
        }
    }],
    [ECFType.XY]: [{
        name: "start",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(100),
            range: [0, 1] as [number, number]
        }
    }, {
        name: "end",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(100),
            range: [0, 1] as [number, number]
        }
    }, {
        name: "x",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(0.1),
            range: [-500, 500] as [number, number]
        }
    }, {
        name: "y",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(0.1),
            range: [-500, 500] as [number, number]
        }
    }, {
        name: "xa",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(10),
            range: [-10, 10] as [number, number]
        }
    }, {
        name: "ya",
        type: EParamType.Number,
        props: {
            valueD: ValueD.VerticalLinear(10),
            range: [-10, 10] as [number, number]
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
    [ECFType.SIN]:
        ({params, range, pattern}) =>
            ({startValue, time, position}) => startValue + params.a * (range[1] - range[0]) * Math.sin(time / params.t),
    [ECFType.LOOP]:
        ({params, range, pattern}) =>
            ({startValue, time, position}) => {

                const t = (time % params.t) / params.t;

                const S = params.start * (range[1] - range[0]);
                const E = params.end * (range[1] - range[0]);
                const ES = E - S;

                return (((startValue - S) + ES * t )  % ES + S);
            },
    [ECFType.XY]:
        ({params, range, pattern}) =>
            ({startValue, time, position}) => {
                const {x: X, y: Y, c: C, xa, ya, start, end} = params;
                const z = Math.pow(position.x - pattern.current.width / 2, 2) / X * xa
                    + Math.pow(position.y - pattern.current.height / 2, 2) * ya / Y;

                const m = Math.pow(-pattern.current.width / 2, 2) / X * xa
                    + Math.pow(-pattern.current.height / 2, 2) * ya / Y;

                const startValueNormalized = startValue / (range[1] - range[0]);


                return Math.max(
                    Math.min(
                        (+z / m * (1 - startValueNormalized) * end) * (range[1] - range[0]) + startValue,
                        range[1]),
                    range[0]
                );
            },
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