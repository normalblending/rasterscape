import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/buttons/ButtonNumber";
import {xyParaboloid} from "./helpers";
import {coordHelper, redHelper} from "../../../components/Area/canvasPosition.servise";

export const xyParaboloidInitialParams = {
    zd: 0,
    end: 1,
    x: 1.5,
    y: 1.5,
};

export const xyParaboloidParamsConfig = [{
    name: "zd",
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

export const xyParaboloidNumberChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {

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
        };
export const xyParaboloidVideoChangeFunction =
        (x, y, width, height, params) => {

            const {x: xk, y: yk, end, zd} = params;

            const f = xyParaboloid(1/2, 1/2, xk, yk);


            const xnorm = x / width;
            const ynorm = y / height;
            const znorm = f(xnorm, ynorm) * end + zd;

            // (range[1] - startValue) * end;

            return znorm * width;
        };
