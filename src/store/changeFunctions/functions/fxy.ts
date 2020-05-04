import {xyParaboloid, xySis2} from "./_helpers";

export enum FxyType {
    Parab = 'parab',
    Sis2 = 'sis2',
}

export interface ParabParams {
    zd: number
    end: number
    x: number
    y: number
}

export interface Sis2Params {
    end: number
    cosA: number
    h: number
    xN: number
    yN: number
    xD: number
    yD: number
    XA: number
    xdd: number
    ydd: number

}

export type AnyFxyParams = ParabParams | Sis2Params;

export interface FxyParams {
    type: FxyType
    typeParams: {
        [key: string]: AnyFxyParams
    }
}

export const fxyInitialParams: FxyParams = {
    type: FxyType.Parab,
    typeParams: {
        [FxyType.Parab]: {
            zd: 0,
            end: 1,
            x: 1.5,
            y: 1.5,
        },
        [FxyType.Sis2]: {
            end: 1,
            XA: 1.6,
            h: 0,
            cosA: 0,
            xN: 1,
            xD: 1,
            yN: 1,
            yD: 1,
            xdd: 0,
            ydd: 0,
        },
    },

};
export const fxyParamsConfig = {};


const fxyFunctionByType = {
    [FxyType.Parab]: ({startValue, range, params, pattern, position}) => {

        const {x, y, end, zd} = params;

        const f = xyParaboloid(1/2, 1/2, x, y);

        const width = pattern.current.width;
        const height = pattern.current.height;

        const xnorm = position.x / width;
        const ynorm = position.y / height;
        const znorm = f(xnorm, ynorm) + zd;

        // (range[1] - startValue) * end;

        return Math.max(
            Math.min(
                (znorm * end ) * (range[1] - range[0]) + startValue,
                startValue + (range[1] - startValue) * end
            ),
            startValue
        );

    },
    [FxyType.Sis2]: ({startValue, range, params, pattern, position}) => {

        const {end} = params;
        const f = xySis2(params);

        const width = pattern.current.width;
        const height = pattern.current.height;

        const xnorm = position.x / width;
        const ynorm = position.y / height;
        const znorm = f(xnorm, ynorm) * end;


        return Math.max(
            Math.min(
                (znorm * end ) * (range[1] - range[0]) + startValue,
                startValue + (range[1] - startValue) * end
            ),
            startValue
        );

    },
};

export const fxyChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {

            return fxyFunctionByType[params.type]({
                startValue,
                range,
                params: params.typeParams[params.type],
                pattern,
                position
            })
        };

// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO

export const xyVideoFunctionByType = {
    [FxyType.Parab]: ({x, y, width, height, params}) => {

        const {x: xk, y: yk, end, zd} = params;

        const f = xyParaboloid(1/2, 1/2, xk, yk);


        const xnorm = x / width;
        const ynorm = y / height;
        const znorm = f(xnorm, ynorm) * end + zd;

        // (range[1] - startValue) * end;

        return znorm * width;
    },
    [FxyType.Sis2]: ({x, y, width, height, params}) => {


        const f = xySis2(params);


        const xnorm = x / width;
        const ynorm = y / height;
        const znorm = f(xnorm, ynorm) * params.end;

        // (range[1] - startValue) * end;

        return znorm * width;
    }
};


export const fxyVideoChangeFunction =
    (x, y, width, height, params: FxyParams) => {

        return xyVideoFunctionByType[params.type]({
            x, y, width, height,
            params: params.typeParams[params.type]
        });
    };
