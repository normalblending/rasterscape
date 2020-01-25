import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/ButtonNumber";

export const sinInitialParams = {
    a: 0.3,
    t: 300,
    p: 0,
};

export const sinParamsConfig = [{
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
}];

export const sinChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) =>
            startValue + params.a * (range[1] - range[0]) * Math.sin(time / params.t);