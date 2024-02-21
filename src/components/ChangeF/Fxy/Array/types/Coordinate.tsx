import * as React from "react";
import {CutShape} from "../../../../_shared/CutShape/CutShape";
import './Coordinate.scss';
import {ButtonNumberCF} from "../../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {DrawCenterParams, DrawType, WaveType} from "../../../../../store/changeFunctions/functions/wave";
import {withTranslation} from "react-i18next";
import {useCallback} from "react";
import {coordHelper5} from "../../../../Area/canvasPosition.servise";
import {
    FxyArrayTypeComponentPropsWithTranslation, FxyArrayTypeComponentType
} from "./types";
import {SVG} from "../../../../_shared/SVG";
import {createVector} from "../../../../../utils/vector";
import {lineSVG} from "../../../../_shared/SVG/_utils";
import {ButtonHK} from "../../../../_shared/buttons/hotkeyed/ButtonHK";
import {FxyArrayCoordinateParams, FxyArrayType, FxyType} from "../../../../../store/changeFunctions/functions/fxy";

const width = 208;
const height = 138;


export const svgCoordinateAxis = (width, height, coordinate) => {
    let step = 0.25;

    const res = [];
    for (let i = step; i < 1; i += step) {
        const pointX = i * width;
        const text = `${i * 100}%`;

        res.push(
            <line
                x1={pointX}
                y1={height - 3}
                x2={pointX}
                y2={height}
                strokeWidth={1}
                stroke={'white'}
            />
        );
        res.push(
            <text
                x={pointX + 2}
                y={height - 6}
                fontSize={9}
                fill={'white'}
            >{text}</text>
        );
    }

    res.push(
        <text
            x={width - 11}
            y={height - 6}
            fontSize={9}
            fill={'white'}
        >{coordinate}</text>
    )


    return (
        <>
            {res}
        </>
    );
};


export const svgAmplitudeAxis = (width, height, from, to, t) => {
    const marks = [];
    marks.push(
        <text
            x={5}
            y={height - 6}
            fontSize={9}
            fill={'white'}
        >{Math.min(from, to).toFixed(2)}</text>
    );
    marks.push(
        <text
            x={5}
            y={11}
            fontSize={9}
            fill={'white'}
        >{Math.max(from, to).toFixed(2)}</text>
    );

    return (
        <>
            {marks}
        </>
    );
};

export const FxyArrayCoordinates = (coordinate: 'x' | 'y'): FxyArrayTypeComponentType<FxyArrayCoordinateParams> => {
    const Component = (props: FxyArrayTypeComponentPropsWithTranslation<FxyArrayCoordinateParams>) => {

        const ArrayType = {
            x: FxyArrayType.X,
            y: FxyArrayType.Y,
        }[coordinate];

        const {
            t,
            params,
            functionParams,
            onChange,
        } = props;

        const handleChangeCutShape = useCallback((_, value: Int32Array) => {
            onChange({...params, valuesArray: value}, functionParams)
        }, [params, functionParams]);

        const handleParamChange = useCallback(({value, name}) => {
            onChange({...params, [name.split('.').reverse()[0]]: value}, functionParams)
        }, [onChange, params, functionParams]);


        const axis = React.useMemo(() => {
            return <SVG
                className={'axis'}
                width={208}
                height={138}
            >

                {svgCoordinateAxis(width, height, coordinate)}
                {svgAmplitudeAxis(width, height, params.from, params.to, t)}
            </SVG>
        }, [params.from, params.to]);
        return (
            <div className={'fxy-array-coord-form'}>
                <div className={'cut-shape-container'}>
                    <CutShape
                        valueWidth={params.drawWidth}
                        valueHeight={params.drawHeight}
                        width={208}
                        height={138}
                        value={params.valuesArray}
                        onChange={handleChangeCutShape}
                        inverse={params.from > params.to}
                        // changeOnUp//={false}
                    />
                    {axis}
                </div>
                <div className={'flex-row'}>
                    <ButtonNumberCF
                        pres={0}
                        integer
                        hkLabel={'cf.hotkeysDescription.wave.draw.drawWidth'} //!!!
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${FxyType.Array}.typeParams.${ArrayType}.drawWidth`}
                        value={params.drawWidth}
                        name={`changeFunctions.${functionParams.id}.drawWidth`}
                        from={1}
                        to={1000}
                        onChange={handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
                        integer
                        hkLabel={'cf.hotkeysDescription.wave.draw.drawHeight'} //!!!
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${FxyType.Array}.typeParams.${ArrayType}.drawHeight`}
                        value={params.drawHeight}
                        name={`changeFunctions.${functionParams.id}.drawHeight`}
                        from={1}
                        to={1000}
                        onChange={handleParamChange}
                    />

                </div>
                <div className={'flex-row'}>
                    <ButtonNumberCF
                        pres={2}
                        hkLabel={'cf.hotkeysDescription.wave.draw.center.from'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${FxyType.Array}.typeParams.${ArrayType}.from`}
                        value={params.from}
                        name={`from`}
                        from={0}
                        to={1}
                        onChange={handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        hkLabel={'cf.hotkeysDescription.wave.draw.to'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${FxyType.Array}.typeParams.${ArrayType}.to`}
                        value={params.to}
                        name={`changeFunctions.${functionParams.id}.to`}
                        from={0}
                        to={1}
                        onChange={handleParamChange}
                    />
                </div>
            </div>
        );
    }
    return withTranslation('common')(Component);
}
