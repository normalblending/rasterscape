import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/buttons/ButtonNumber";
import {xyParaboloid} from "./helpers";

export enum FxyType {
    Parab = 'parab',
}

export interface ParabParams {
    zd: number
    end: number
    x: number
    y: number
}

export type AnyFxyParams = ParabParams;

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
    }
};


export const fxyVideoChangeFunction =
    (x, y, width, height, params: FxyParams) => {

        return xyVideoFunctionByType[params.type]({
            x, y, width, height,
            params: params.typeParams[params.type]
        });
    };
