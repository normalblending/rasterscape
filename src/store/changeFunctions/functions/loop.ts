import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/buttons/ButtonNumber";

export const loopInitialParams = {
    start: 0,
    end: 1,
    t: 3000,
    p: 0,
};

export interface LoopParamConfig {
    name: string
    type: EParamType
    props: any
}

export const loopParamsConfig: LoopParamConfig[] = [{
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
}];

export const loopChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {


            if (!params.t) return startValue;

            const t = (time % params.t) / params.t; // смещение по времени внутри цыкла

            const R = range[1] - range[0];
            const S = params.start * (range[1] - range[0]);
            const E = params.end * (range[1] - range[0]);
            const ES = E - S;

            const d = ES * t;


            const start = Math.max(Math.min(startValue, E), S);

            let newValue = start - d;

            if (newValue < S) {
                newValue += ES;
            }

            if (newValue > E) {
                newValue -= ES;
            }

            return newValue;
        };