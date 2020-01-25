import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/ButtonNumber";

export const xyInitialParams = {
    start: 0,
    end: 1,
    x: 150,
    y: 150,
    xa: 1,
    ya: 1
};

export const xyParamsConfig = [{
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
}];

export const xyChangeFunction =
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
        };