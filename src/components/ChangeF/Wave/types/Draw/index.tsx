import * as React from "react";
import './styles.scss';
import {useCallback, useState} from "react";
import {ChangeFunctionState} from "../../../../../store/changeFunctions/types";
import {AnyDrawWaveParams, DrawParams, DrawType} from "../../../../../store/changeFunctions/functions/wave";
import {SelectDrop} from "../../../../_shared/buttons/complex/SelectDrop";
import {WithTranslation, withTranslation} from "react-i18next";
import {CropDrawWave} from "./types/Crop";
import {CenterDrawWave} from "./types/Center";
import {StretchDrawWave} from "./types/Stretch";
import {DrawTypeComponentType} from "./types/types";
import {arrayToSelectItems} from "../../../../../utils/utils";


export interface WaveDrawProps extends WithTranslation {
    params: DrawParams

    name: string

    functionParams: ChangeFunctionState

    onChange(value: any, name: string)
}

const drawComponentsByType: {
    [type: string]: DrawTypeComponentType<any>
} = {
    [DrawType.Center]: CenterDrawWave,
    [DrawType.Stretch]: StretchDrawWave,
};

const typesSelectItems = arrayToSelectItems([DrawType.Center, DrawType.Stretch]);

export const Draw2dCF = withTranslation('common')((props: WaveDrawProps) => {

    const {params, name, functionParams, onChange, t} = props;

    const [value, setValue] = useState<number[]>([]);
    // const [value, setValue] = useState<number[]>((Array.from(Array(210))).map((o, i) => i * 140 / 210));

    const {
        type,
        typeParams,
    } = params;


    const typeText = ({value}) => t('cf.wave.draw.type.' + value);

    const DrawTypeComponent: DrawTypeComponentType<any> = drawComponentsByType[type];

    const handleChange = React.useCallback((newTypeParams: AnyDrawWaveParams, functionParams: ChangeFunctionState) => {
        onChange({
            ...params,
            typeParams: {
                ...params.typeParams,
                [type]: newTypeParams
            }
        }, name);
    }, [params, type, onChange, name]);

    const handleTypeChange = useCallback(({value}) => {
        onChange({
            ...params,
            type: value
        }, name)
    }, [onChange, name, params]);

    return (
        <div className={'draw-wave-cf'}>
            <SelectDrop
                name={`cf.${name}.draw.type`}
                className={'draw-type-select'}
                getText={typeText}
                hkLabel={'cf.hotkeysDescription.wave.draw.type'}
                hkData1={params.type}
                value={params.type}
                onChange={handleTypeChange}
                items={typesSelectItems}
            />
            <DrawTypeComponent
                params={typeParams[type]}
                functionParams={functionParams}
                onChange={handleChange}
            />
        </div>
    );
});
