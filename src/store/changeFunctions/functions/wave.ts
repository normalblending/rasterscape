import {coordHelper4, coordHelper5} from "../../../components/Area/canvasPosition.servise";

export enum WaveType {
    Sin = 'sin',
    Saw = 'saw',
    Noise = 'noise',
}

export interface SinParams {
    a: number
    t: number
    o: number
}

export interface SawParams {
    start: number
    end: number
    t: number
}


export interface NoiseParams {
    start: number
    end: number
    f: number
}

export type AnyWaveParams = SinParams | SawParams | NoiseParams;

export interface WaveParams {
    type: WaveType
    typeParams: {
        [key: string]: AnyWaveParams
    }
}

export const waveInitialParams: WaveParams = {
    type: WaveType.Sin,
    typeParams: {
        [WaveType.Sin]: {
            a: 0.3,
            t: 3000,
            o: 0,
        },
        [WaveType.Saw]: {
            start: 0,
            end: 1,
            t: 3000,
        },
        [WaveType.Noise]: {
            start: 0,
            end: 1,
            f: 0.5,
        }
    },

};
export const waveParamsConfig = {};


const waveFunctionByType: {
    [type: string]: (options: {
        startValue: number
        range: [number, number]
        params: any
        time: number
    }, prev?: any) => {
        value?: number
        prev?: any
    }
} = {
    [WaveType.Sin]: ({startValue, range, params, time}) => {
        return {
            value: startValue + params.a * (range[1] - range[0]) * Math.sin((time) / params.t * 2 * Math.PI + params.o * 2 * Math.PI)
        }
    },
    [WaveType.Saw]: ({startValue, range, params, time}) => {
        if (!params.t) return {};

        const t = (time % params.t) / params.t; // смещение по времени внутри цыкла в процентах %

        const R = range[1] - range[0];
        const S = params.start * R;
        const E = params.end * R;
        const ES = E - S;

        const d = ES * t;

        const SV = startValue - range[0];

        const start = Math.min(Math.max(SV, Math.min(S, E)), Math.max(S, E));


        let newValue = start + d;


        if (newValue < Math.min(S, E)) {
            newValue += Math.abs(ES);
        }

        if (newValue > Math.max(S, E)) {
            newValue -= Math.abs(ES);
        }

        return {value: newValue + range[0]};
    },
    [WaveType.Noise]: ({startValue, range, params, time}, prev) => {
        const {start: amplitude, end, f} = params;
        const T = f;
        const period = Math.floor(time / T);


        // console.log(prev?.period !== period)
        if (prev?.period !== period) {
            const random = Math.random();
            // coordHelper5.setText(prev?.period, period, time);

            const min = startValue - (range[1] - range[0]) * amplitude;
            const max = startValue + (range[1] - range[0]) * amplitude;

            const newValue = Math.min(Math.max(min + random * (max - min), range[0]), range[1]);
            // coordHelper5.setText(newValue);

            return {
                value: newValue,
                prev: {
                    period,
                }
            };
        } else {
            return {
                prev: {
                    period
                }
            };
        }
    }

};

export const waveChangeFunction = () => {
    let prev = {};
    return ({params, range, pattern, startValue, time, position}) => {
        const {
            value,
            prev: newPrev
        } = waveFunctionByType[params.type]({
            startValue,
            range,
            params: params.typeParams[params.type],
            time,
        }, prev);

        // coordHelper5.setText(value);

        prev = newPrev;

        return value;
    }
};
