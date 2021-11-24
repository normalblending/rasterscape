import {
    curveTypesSelectItems,
    selectionModesSelectItems
} from "../../components/Area/Selection";
import {
    CurveValueName,
    ESelectionMode, SelectToolParams
} from "./types";
import {EParamType, ParamConfig} from "../../components/_shared/Params.types";

export const getSelectToolParamsConfig = (params?: SelectToolParams) => {
    let config: ParamConfig[] = [{
        name: "mode",
        type: EParamType.Select,
        props: {
            items: selectionModesSelectItems,
        }
    }];

    if (params && params.mode === ESelectionMode.Points) {
        config.push({
            name: "curveType",
            type: EParamType.Select,
            props: {
                items: curveTypesSelectItems
            }
        });

        if (Object.keys(CurveValueName).indexOf(params.curveType) !== -1) {
            config = [...config, {
                name: CurveValueName[params.curveType],
                type: EParamType.Number,
                props: {
                    range: [0, 1],
                    text: 1
                }
            }]
        }
    }

    return config;
};