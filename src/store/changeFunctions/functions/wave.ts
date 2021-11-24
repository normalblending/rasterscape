import {coordHelper4, coordHelper5} from "../../../components/Area/canvasPosition.servise";

export enum WaveType {
    Sin = 'sin',
    Saw = 'saw',
    Noise = 'noise',
    Draw = 'draw',
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

export enum DrawType {
    Center = 'center',
    Stretch = 'stretch',
}

export interface DrawCenterParams {
    drawWidth: number
    drawHeight: number
    valuesArray: number[]
    period: number

    offset: number
    amplitude: number

    loop: boolean
}

export interface DrawStretchParams {
    drawWidth: number
    drawHeight: number
    valuesArray: number[]
    period: number

    from: number
    to: number

    loop: boolean
}

export type AnyDrawWaveParams = DrawStretchParams | DrawCenterParams;

export interface DrawParams {
    type: DrawType
    typeParams: {
        [DrawType.Center]: DrawCenterParams
        [DrawType.Stretch]: DrawStretchParams
    }
}

export type AnyWaveParams = SinParams | SawParams | NoiseParams | DrawParams;

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
        },
        [WaveType.Draw]: {
            type: DrawType.Center,
            typeParams: {
                [DrawType.Center]: {
                    drawWidth: 100,
                    drawHeight: 100,
                    valuesArray: new Array(1000).fill(0),
                    period: 3000,

                    offset: 0,
                    amplitude: 1,

                    loop: true,
                },
                [DrawType.Stretch]: {
                    drawWidth: 100,
                    drawHeight: 100,
                    valuesArray: new Array(1000).fill(0),
                    period: 3000,

                    from: 0,
                    to: 1,

                    loop: true,
                }
            },
        }
    },

};
export const waveParamsConfig = {}; //?

const drawWaveFunctionByType: {
    [type: string]: (options: {
        startValue: number
        range: [number, number]
        params: AnyDrawWaveParams
        time: number
    }, prev?: any) => {
        value?: number
        prev?: any // хранилище для межитерационных данных
    }
} = {
    [DrawType.Center]: ({startValue, range, params, time}, prev) => {
        const {offset, period, loop, drawWidth, drawHeight, amplitude, valuesArray} = params as DrawCenterParams;

        const t = (time % period) / period; // смещение по времени внутри цыкла в процентах %

        const i = !loop && time >= period  // если не нужно зацылить
            ? drawWidth - 1 // последний элемент в массиве
            : Math.floor(drawWidth * t) // координа в массиве

        const timeValue = i < drawWidth ? (valuesArray[i]) / drawHeight : 0; // значение соответствующее времени

        const R = range[1] - range[0]; //

        // const min = startValue - R * amplitude;
        // const max = startValue + R * amplitude;

        const newValue = startValue + timeValue * amplitude * R - offset * amplitude * R;
        // coordHelper5.setText(newValue);

        return {
            value: Math.min(Math.max(newValue, range[0]), range[1]),
        };
    },
    [DrawType.Stretch]: ({startValue, range, params, time}, prev) => {
        const {from, to, period, loop, drawWidth, drawHeight, valuesArray} = params as DrawStretchParams;

        const amplitude = Math.abs(to - from);
        const min = Math.min(from, to);
        const inverse = to < from;

        const t = (time % period) / period; // смещение по времени внутри цыкла в процентах %

        const i = !loop && time >= period  // если не нужно зацылить
            ? drawWidth - 1 // последний элемент в массиве
            : Math.floor(drawWidth * t) // координа в массиве

        const timeValue = i < drawWidth
            ? (
                inverse
                    ? (drawHeight - valuesArray[i])
                    : valuesArray[i]
                ) / drawHeight
            : 0; // значение соответствующее времени

        const R = range[1] - range[0]; //

        // const min = startValue - R * amplitude;
        // const max = startValue + R * amplitude;

        const newValue = min * R + timeValue * amplitude * R;
        // coordHelper5.setText(newValue);

        return {
            value: Math.min(Math.max(newValue, range[0]), range[1]),
        };
    },
};

const waveFunctionByType: {
    [type: string]: (options: {
        startValue: number
        range: [number, number]
        params: any
        time: number
    }, prev?: any) => {
        value?: number
        prev?: any // хранилище для межитерационных данных
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
    },
    [WaveType.Draw]: ({startValue, range, params, time}, prev) => {
        const {
            type,
            typeParams,
        }: DrawParams = params;

        return drawWaveFunctionByType[type](
            {startValue, range, params: typeParams[type], time}, prev
        );
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
