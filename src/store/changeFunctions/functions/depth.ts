import {EParamType} from "../../../components/_shared/Params";
import {ValueD} from "../../../components/_shared/buttons/ButtonNumber";
import {xyParaboloid} from "./_helpers";

export const depthInitialParams = {
    items: [],
};

export const depthNumberChangeFunction =
    ({params, range, pattern}) =>
        ({startValue, time, position}) => {

            return startValue;

            const {items} = params;


            const f = (x, y) => {
                return items?.reduce((res, item) => {
                    const {patternId, zed, zd, component} = item;
                    const imageData = pattern.current.imageData;

                    const xnorm = Math.round(x / pattern.current.width * (imageData.width || 0));
                    const ynorm = Math.round(y / pattern.current.height * (imageData.height || 0));

                    return res + imageData.data[(xnorm + ynorm * imageData.width) * 4 + component] / 255 * zed + zd;
                }, 0) || 0;

            };

            const width = pattern.current.width;
            const height = pattern.current.height;

            const xnorm = position.x / width;
            const ynorm = position.y / height;
            const znorm = f(xnorm, ynorm);

            // (range[1] - startValue) * end;

            // return Math.max(
            //     Math.min(
            //         (znorm * end) * (range[1] - range[0]) + startValue,
            //         startValue + (range[1] - startValue) * end
            //     ),
            //     startValue
            // );
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

                return res + imageData.data[(xnorm + ynorm * imageData.width) * 4 + component] / 255 * zed + zd;
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