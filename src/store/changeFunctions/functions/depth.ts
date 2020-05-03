import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/buttons/ButtonNumber";
import {xyParaboloid} from "./helpers";
import {coordHelper, coordHelper2, redHelper} from "../../../components/Area/canvasPosition.servise";
import {get} from "../../patterns/video/capture/pixels";

export const depthInitialParams = {
    // zd: 0,
    // zed: 1,
    items: [],
    // component: 0
};

export const depthNumberChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {

            const {x, y, end, zd} = params;

            const f = (a, b) => 0;//depth(1/2, 1/2, x, y);

            const width = pattern.current.width;
            const height = pattern.current.height;

            const xnorm = position.x / width;
            const ynorm = position.y / height;
            const znorm = f(xnorm, ynorm) + zd;

            // (range[1] - startValue) * end;

            return Math.max(
                Math.min(
                    (znorm * end) * (range[1] - range[0]) + startValue,
                    startValue + (range[1] - startValue) * end
                ),
                startValue
            );
        };
export const depthVideoChangeFunction =
    (x, y, patternWidth, patternHeight, params, patterns) => {

        const {items} = params;



        const f = (x, y) => {
            return items?.reduce((res, item) => {
                const {patternId, zed, zd, component} = item;
                const imageData = patterns[patternId].current.imageData;

                const xnorm = Math.round(x / patternWidth * (imageData.width || 0));
                const ynorm = Math.round(y / patternHeight * (imageData.height || 0));

                return res + imageData.data[(xnorm + ynorm * imageData.width) * 4 + component]/255 * zed + zd;
            }, 0) || 0;

        };


        const znorm = f(x, y);

        return znorm * patternWidth;
    };


export const depthParamsConfig = [{
    name: "zd",
    type: EParamType.Number,
    props: {
        valueD: ValueD.VerticalLinear(100),
        range: [0, 1] as [number, number]
    }
}, {
    name: "zed",
    type: EParamType.Number,
    props: {
        valueD: ValueD.VerticalLinear(100),
        range: [0, 1] as [number, number]
    }
}, {
    name: "image",
    type: EParamType.ImageData,
}];