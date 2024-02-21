import * as React from "react";
import './styles.scss';
import {useCallback, useState} from "react";
import {ChangeFunctionState} from "../../../../store/changeFunctions/types";
import {AnyDrawWaveParams, DrawParams, DrawType} from "../../../../store/changeFunctions/functions/wave";
import {SelectDrop} from "../../../_shared/buttons/complex/SelectDrop";
import {WithTranslation, withTranslation} from "react-i18next";
import {FxyArrayTypeComponentType} from "./types/types";
import {arrayToSelectItems} from "../../../../utils/utils";
import {
    AnyFxyParams,
    FxyArrayParams,
    FxyArrayType,
    FxyParams,
    FxyType
} from "../../../../store/changeFunctions/functions/fxy";
import {FxyArrayCoordinates} from "./types/Coordinate";
import {FxyTypeComponentPropsWithTranslation} from "../types";


export interface FxyArrayProps extends WithTranslation {
    params: DrawParams

    name: string

    functionParams: ChangeFunctionState

    onChange(value: any, name: string)
}

const arrayComponentsByType: {
    [type: string]: FxyArrayTypeComponentType<any>
} = {
    [FxyArrayType.X]: FxyArrayCoordinates('x'),
    [FxyArrayType.Y]: FxyArrayCoordinates('y'),
};

const typesSelectItems = arrayToSelectItems([FxyArrayType.X, FxyArrayType.Y]);

export const FxyArrayCF = withTranslation('common')((props: FxyTypeComponentPropsWithTranslation<FxyParams>) => {

    const {params, name, functionParams, onChange, t} = props;

    const [value, setValue] = useState<number[]>([]);
    // const [value, setValue] = useState<number[]>((Array.from(Array(210))).map((o, i) => i * 140 / 210));

    const {
        type,
        typeParams,
    } = params;


    const typeText = ({value}) => t('cf.xy.array.type.' + value);

    const FxyArrayTypeComponent: FxyArrayTypeComponentType<any> = arrayComponentsByType[type];

    const handleChange = React.useCallback((newTypeParams: AnyFxyParams, functionParams: ChangeFunctionState) => {
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
        <div className={'fxy-array'}>
            <SelectDrop
                name={`cf.${name}.array.type`}
                className={'fxy-array-type-select'}
                getText={typeText}
                hkLabel={'cf.hotkeysDescription.wave.draw.type'}
                hkData1={params.type}
                value={params.type}
                onChange={handleTypeChange}
                items={typesSelectItems}
            />
            <FxyArrayTypeComponent
                params={typeParams[type]}
                functionParams={functionParams}
                onChange={handleChange}
            />
        </div>
    );
});
