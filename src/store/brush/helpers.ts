import {BrushParams,EBrushCompositeOperation, EBrushType} from "./types";
import {EParamType, ParamConfig} from "../../components/_shared/Params";
import {ValueD} from "../../components/_shared/ButtonNumber";
import {arrayToSelectItems} from "../../utils/utils";

const typeSelectItems = arrayToSelectItems(Object.values(EBrushType));
const compositeOperationSelectItems = arrayToSelectItems(Object.values(EBrushCompositeOperation));
const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.5);
const opacityRange = [0, 1] as [number, number];
const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(200);

export const getBrushParamsConfig = (params?: BrushParams) => {
    const config: ParamConfig[] = [{
        name: "size",
        type: EParamType.Number,
        props: {
            range: sizeRange,
            valueD: sizeValueD
        }
    }, {
        name: "opacity",
        type: EParamType.Number,
        props: {
            range: opacityRange,
        }
    }, {
        name: "type",
        type: EParamType.Select,
        props: {
            items: typeSelectItems,
        }
    }, {
        name: "compositeOperation",
        type: EParamType.Select,
        props: {
            items: compositeOperationSelectItems,
        }
    }, {
        name: "patternSize",
        type: EParamType.Number,
        props: {
            range: patternSizeRange,
            valueD: patternSizeValueD
        }
    }];

    return config
};