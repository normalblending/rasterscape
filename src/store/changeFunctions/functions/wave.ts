export enum WaveType {
    Sin = 'sin',
    Saw = 'saw'
}

export interface SinParams {
    a: number
    t: number
    o: number
}

export interface SawParams {
    start: 0,
    end: 1,
    t: 3000,
}

export type AnyWaveParams = SinParams | SawParams;

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
        }
    },

};
export const waveParamsConfig = {};


const waveFunctionByType = {
    [WaveType.Sin]: ({startValue, range, params, time}) => {
        return startValue + params.a * (range[1] - range[0]) * Math.sin((time) / params.t * 2 * Math.PI + params.o * 2 * Math.PI)
    },
    [WaveType.Saw]: ({startValue, range, params, time}) => {
        if (!params.t) return startValue;

        const t = (time % params.t) / params.t; // смещение по времени внутри цыкла

        const R = range[1] - range[0];
        const S = params.start * (range[1] - range[0]);
        const E = params.end * (range[1] - range[0]);
        const ES = E - S;

        const d = ES * t;


        const start = Math.min(Math.max(startValue, Math.min(S, E)), Math.max(S, E));


        let newValue = start + d;


        if (newValue < Math.min(S, E)) {
            newValue += Math.abs(ES);
        }

        if (newValue > Math.max(S, E)) {
            newValue -= Math.abs(ES);
        }

        return newValue;
    },
};

export const waveChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {

            return waveFunctionByType[params.type]({
                startValue,
                range,
                params: params.typeParams[params.type],
                time,
            })
        };
