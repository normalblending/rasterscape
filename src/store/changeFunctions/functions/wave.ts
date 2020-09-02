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


const waveFunctionByType = {
    [WaveType.Sin]: ({startValue, range, params, time}) => {
        return startValue + params.a * (range[1] - range[0]) * Math.sin((time) / params.t * 2 * Math.PI + params.o * 2 * Math.PI)
    },
    [WaveType.Saw]: ({startValue, range, params, time}) => {
        if (!params.t) return startValue;

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

        return newValue + range[0];
    },
    [WaveType.Noise]: (() => {
        let random = 0;
        let prevPeriod = 0;
        return ({startValue, range, params, time}) => {
            const {start: amplitude, end, f} = params;
            const T = f;
            const period = Math.floor(time / T);


            if (prevPeriod !== period) {
                random = Math.random();

                console.log(period, 'period')
                prevPeriod = period;
            }


            const min = startValue - (range[1] - range[0]) * amplitude;
            const max = startValue + (range[1] - range[0]) * amplitude;

            const newValue = Math.min(Math.max(min + random * (max - min), range[0]), range[1]);



            return newValue;
        }
    })()
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
