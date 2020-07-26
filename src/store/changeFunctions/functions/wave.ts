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
    [WaveType.Noise]: (() => {
        let random = 0;
        let prevPeriod = 0;
        return ({startValue, range, params, time}) => {
            const {start, end, f} = params;
            const T = f;
            const period = Math.floor(time / T);


            if (prevPeriod !== period) {
                random = Math.random();

                console.log(period, 'period')
                prevPeriod = period;
            }


            const min = range[0] + (range[1] - range[0]) * start;
            const max = range[0] + (range[1] - range[0]) * end;

            const newValue = random * (max - min) + min;



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
