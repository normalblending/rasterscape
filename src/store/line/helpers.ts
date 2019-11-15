
import {EParamType, ParamConfig} from "../../components/_shared/Params";
import {selectionModesSelectItems} from "../../components/Area/Selection";
import {ValueD} from "../../components/_shared/ButtonNumber";
import {arrayToSelectItems} from "../../utils/utils";
import {ELineType, LineParams} from "./types";

const typeSelectItems = arrayToSelectItems(Object.values(ELineType));
const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.5);
const opacityRange = [0, 1] as [number, number];

export const getLineParamsConfig = (params?: LineParams) => {
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
    }];

    return config
};