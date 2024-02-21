import {ValueD} from "../../components/_shared/buttons/complex/ButtonNumber";
import {arrayToSelectItems, enumToSelectItems} from "../../utils/utils";
import {ELineCapType, ELineJoinType, ELineRandomType, ELineType, LineParams} from "./types";
import {compositeOperationSelectItems} from "../compositeOperations";
import {EParamType, ParamConfig} from "../../components/_shared/Params.types";

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
            items: typeSelectItems,//typeSelectItems.filter(({value}) => value !== ELineType.Pattern),
        }
    }, {
        name: "compositeOperation",
        type: EParamType.Select,
        props: {
            items: compositeOperationSelectItems,
        }
    }];

    return config
};

export const capsSelectItems = enumToSelectItems(ELineCapType);
export const joinsSelectItems = enumToSelectItems(ELineJoinType);
export const randomSelectItems = enumToSelectItems(ELineRandomType);