import * as React from "react";
import {useCallback} from "react";
import {coordHelper5} from "../../../../../Area/canvasPosition.servise";
import {CutShape} from "../../../../../_shared/CutShape/CutShape";
import {ButtonNumberCF} from "../../../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {DrawStretchParams, DrawType, WaveType} from "../../../../../../store/changeFunctions/functions/wave";
import {withTranslation} from "react-i18next";
import {
    DrawTypeComponentPropsWithTranslation,
    DrawTypeComponentType
} from "./types";
import {SVG} from "../../../../../_shared/SVG";
import {ButtonHK} from "../../../../../_shared/buttons/hotkeyed/ButtonHK";
import './Stretch.scss'

const width = 208;
const height = 138;
const drawAxisMarks = (ctx: CanvasRenderingContext2D, width, y, period, step, t, secs?: boolean) => {
    ctx.beginPath();
    for (let i = step; i < period; i += step) {
        const pointX = i / period * width;
        ctx.moveTo(pointX, y - 3);
        ctx.lineTo(pointX, y + 3);

        const text = secs ? `${i / 1000}${t('utils.sec')}` : `${i}${t('utils.milliSec')}`;
        ctx.fillText(text, pointX, y + 10);
    }
    ctx.stroke();
};

const svgYAxisMarks = (width, height, y, period, step, t, secs?: boolean) => {
    const res = [];
    for (let i = step; i < period; i += step) {
        const pointX = i / period * width;
        const text = secs ? `${i / 1000}${t('utils.sec')}` : `${i}${t('utils.milliSec')}`;

        const down = y < (height / 2 + 20);
        res.push(
            <line
                x1={pointX}
                y1={y - 3}
                x2={pointX}
                y2={y + 3}
                strokeWidth={1}
                stroke={'white'}
            />
        );
        res.push(
            <text
                x={pointX + 2}
                y={down ? (y + 11) : (y - 6)}
                fontSize={9}
                fill={'white'}
            >{text}</text>
        );
    }
    return res;
};


export const svgTimeAxis = (width, height, y, period, t) => {
    let step = 0;
    if (period < 10) {
        step = 2.5;
    } else if (period < 20) {
        step = 5;
    } else if (period < 40) {
        step = 10;
    } else if (period < 100) {
        step = 20;
    } else if (period < 200) {
        step = 40;
    } else if (period < 250) {
        step = 50;
    } else if (period < 500) {
        step = 100;
    } else if (period < 1000) {
        step = 250;
    } else if (period < 2500) {
        step = 500;
    } else if (period < 5000) {
        step = 1000;
    } else if (period < 10000) {
        step = 2500;
    } else if (period < 20000) {
        step = 5000;
    } else if (period <= 40000) {
        step = 10000;
    }

    return (
        <>
            <line
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                strokeWidth={1}
                stroke={'white'}
            />
            {svgYAxisMarks(width, height, y, period, step, t, step >= 500)}
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

export const StretchDrawWave: DrawTypeComponentType<DrawStretchParams> = withTranslation('common')((props: DrawTypeComponentPropsWithTranslation<DrawStretchParams>) => {

    const {
        t,
        params,
        functionParams,
        onChange,
    } = props;

    const handleChangeCutShape = React.useCallback((_, value: number[]) => {
        onChange({...params, valuesArray: value}, functionParams)
    }, [params, functionParams]);

    const handleParamChange = useCallback(({value, name}) => {
        onChange({...params, [name.split('.').reverse()[0]]: value}, functionParams)
    }, [onChange, params, functionParams]);
    const handleBoolParamChange = useCallback(({selected, name}) => {
        onChange({...params, [name.split('.').reverse()[0]]: !selected}, functionParams)
    }, [onChange, params, functionParams]);

    const axisY = height;

    return (
        <div className={'wave-draw-stretch-form'}>
            <div className={'cut-shape-container'}>
                <CutShape
                    valueWidth={params.drawWidth}
                    valueHeight={params.drawHeight}
                    width={208}
                    height={138}
                    value={params.valuesArray}
                    onChange={handleChangeCutShape}
                    inverse={params.from > params.to}
                    // drawAxis={drawAxis}
                />
                <SVG
                    className={'axis'}
                    width={208}
                    height={138}
                >

                    {svgTimeAxis(width, height, axisY, params.period, t)}
                    {svgAmplitudeAxis(width, height, params.from, params.to, t)}
                </SVG>
            </div>
            <div className={'flex-row'}>
                <ButtonNumberCF
                    pres={0}
                    integer
                    hkLabel={'cf.hotkeysDescription.wave.draw.drawWidth'} //!!!
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.drawWidth`}
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
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.drawHeight`}
                    value={params.drawHeight}
                    name={`changeFunctions.${functionParams.id}.drawHeight`}
                    from={1}
                    to={1000}
                    onChange={handleParamChange}
                />
                <ButtonHK
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.loop`}
                    name={"loop"}
                    hkLabel={'cf.hotkeysDescription.wave.draw.stretch.loop'}
                    hkData1={functionParams.number}
                    onClick={handleBoolParamChange}
                    selected={params.loop}
                >
                    {t('cf.wave.draw.stretch.loop')}
                </ButtonHK>

            </div>
            <div className={'flex-row'}>
                <ButtonNumberCF
                    pres={0}
                    hkLabel={'cf.hotkeysDescription.wave.draw.period'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.period`}
                    value={params.period}
                    name={`period`}
                    from={0}
                    to={40000}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={2}
                    hkLabel={'cf.hotkeysDescription.wave.draw.stretch.offset'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.from`}
                    value={params.from}
                    name={`from`}
                    from={0}
                    to={1}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={2}
                    hkLabel={'cf.hotkeysDescription.wave.draw.amplitude'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Stretch}.to`}
                    value={params.to}
                    name={`to`}
                    from={0}
                    to={1}
                    onChange={handleParamChange}
                />
            </div>
        </div>
    );
});
