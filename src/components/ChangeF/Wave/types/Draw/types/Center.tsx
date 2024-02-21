import * as React from "react";
import {CutShape} from "../../../../../_shared/CutShape/CutShape";
import './Center.scss';
import {ButtonNumberCF} from "../../../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {DrawCenterParams, DrawType, WaveType} from "../../../../../../store/changeFunctions/functions/wave";
import {withTranslation} from "react-i18next";
import {useCallback} from "react";
import {coordHelper5} from "../../../../../Area/canvasPosition.servise";
import {DrawTypeComponentPropsWithTranslation, DrawTypeComponentType} from "./types";
import {SVG} from "../../../../../_shared/SVG";
import {createVector} from "../../../../../../utils/vector";
import {lineSVG} from "../../../../../_shared/SVG/_utils";
import {ButtonHK} from "../../../../../_shared/buttons/hotkeyed/ButtonHK";
import {ButtonSelectEventData} from "../../../../../_shared/buttons/simple/ButtonSelect";

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
            {/*<line*/}
            {/*    x1={0}*/}
            {/*    y1={y}*/}
            {/*    x2={width}*/}
            {/*    y2={y}*/}
            {/*    strokeWidth={1}*/}
            {/*    stroke={'white'}*/}
            {/*/>*/}
            {svgYAxisMarks(width, height, y, period, step, t, step >= 500)}
        </>
    );
};


export const svgAmplitudeAxis = (width, height, amplitude, offset, t) => {
    if (!amplitude) return null;

    let step = 0.1;
    let fixed = 1;
    if (amplitude <= 0.005) {
        step = 0.001;
        fixed = 3;
    } else if (amplitude <= 0.03) {
        step = 0.005;
        fixed = 3;
    } else if (amplitude <= 0.05) {
        step = 0.01;
        fixed = 2;
    } else if (amplitude <= 0.06) {
        step = 0.02;
        fixed = 2;
    } else if (amplitude <= 0.11) {
        step = 0.025;
        fixed = 3;
    } else if (amplitude <= .2) {
        step = .05;
        fixed = 2;
    } else if (amplitude <= .3) {
        step = .075;
        fixed = 3;
    } else if (amplitude <= .4) {
        step = .1;
        fixed = 1;
    } else if (amplitude <= .5) {
        step = .15;
        fixed = 2;
    } else if (amplitude <= .6) {
        step = .2;
        fixed = 1;
    } else if (amplitude <= .8) {
        step = .25;
        fixed = 2;
    } else if (amplitude <= .9) {
        step = .3;
        fixed = 1;
    } else if (amplitude <= 1) {
        step = .4;
        fixed = 1;
    }

    const marks = [];

    const bottomSideHeight = height * offset;
    const bottomSideAmplitude = amplitude * offset;
    const topSideHeight = height * (1 - offset);
    const topSideAmplitude = amplitude * (1 - offset);

    const mark = (i) => {
        const pointY = (1 - offset - i / amplitude) * height;
        const text = `${i.toFixed(fixed)}`;

        // const down = y < (height / 2 + 20);
        marks.push(
            <line
                x1={0}
                y1={pointY}
                x2={3}
                y2={pointY}
                strokeWidth={1}
                stroke={'white'}
            />
        );
        marks.push(
            <text
                x={5}
                y={pointY + 3}
                fontSize={9}
                fill={'white'}
            >{text}</text>
        );
    };

    for (let i = 0; i < topSideAmplitude; i += step) {
        i && mark(i);
    }
    for (let i = 0; i > -bottomSideAmplitude; i -= step) {
        i && mark(i);
    }


    const down = height * (1 - offset) < (height / 2 + 20);

    marks.push(
        <text
            x={5}
            y={down ? (height * (1 - offset) + 11) : (height * (1 - offset) - 6)}
            fontSize={9}
            fill={'white'}
        >{0}</text>
    );

    return (
        <>
            {marks}
        </>
    );
};

export const CenterDrawWave: DrawTypeComponentType<DrawCenterParams> = withTranslation('common')((props: DrawTypeComponentPropsWithTranslation<DrawCenterParams>) => {

    const {
        t,
        params,
        functionParams,
        onChange,
    } = props;

    const handleChangeCutShape = React.useCallback((_, value: Int32Array) => {
        onChange({...params, valuesArray: value}, functionParams)
    }, [params, functionParams]);

    const handleParamChange = useCallback(({value, name}) => {
        onChange({...params, [name.split('.').reverse()[0]]: value}, functionParams)
    }, [onChange, params, functionParams]);
    const handleBoolParamChange = useCallback(({selected, name}: ButtonSelectEventData) => {
        console.log(params, name, name.split('.').reverse()[0], selected);
        onChange({...params, [name.split('.').reverse()[0]]: !selected}, functionParams)
    }, [onChange, params, functionParams]);

    const axisY = height * (1 - params.offset);

    return (
        <div className={'wave-draw-center-form'}>
            <div className={'cut-shape-container'}>
                <CutShape
                    valueWidth={params.drawWidth}
                    valueHeight={params.drawHeight}
                    width={208}
                    height={138}
                    value={params.valuesArray}
                    onChange={handleChangeCutShape}
                    center={params.offset}
                    // drawAxis={drawAxis}
                />
                <SVG
                    className={'axis'}
                    width={208}
                    height={138}
                >

                    {svgTimeAxis(width, height, axisY, params.period, t)}
                    {svgAmplitudeAxis(width, height, params.amplitude, params.offset, t)}
                </SVG>
            </div>
            <div className={'flex-row'}>
                <ButtonNumberCF
                    pres={0}
                    integer
                    hkLabel={'cf.hotkeysDescription.wave.draw.drawWidth'} //!!!
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.drawWidth`}
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
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.drawHeight`}
                    value={params.drawHeight}
                    name={`changeFunctions.${functionParams.id}.drawHeight`}
                    from={1}
                    to={1000}
                    onChange={handleParamChange}
                />
                <ButtonHK
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.loop`}
                    name={"loop"}
                    hkLabel={'cf.hotkeysDescription.wave.draw.center.loop'}
                    hkData1={functionParams.number}
                    onClick={handleBoolParamChange}
                    selected={params.loop}
                >
                    {t('cf.wave.draw.center.loop')}
                </ButtonHK>

            </div>
            <div className={'flex-row'}>
                <ButtonNumberCF
                    pres={0}
                    hkLabel={'cf.hotkeysDescription.wave.draw.period'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.period`}
                    value={params.period}
                    name={`changeFunctions.${functionParams.id}.period`}
                    from={0}
                    to={40000}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={2}
                    hkLabel={'cf.hotkeysDescription.wave.draw.center.offset'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.offset`}
                    value={params.offset}
                    name={`offset`}
                    from={0}
                    to={1}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={2}
                    hkLabel={'cf.hotkeysDescription.wave.draw.amplitude'}
                    hkData1={functionParams.number}
                    path={`changeFunctions.functions.${functionParams.id}.params.typeParams.${WaveType.Draw}.typeParams.${DrawType.Center}.amplitude`}
                    value={params.amplitude}
                    name={`changeFunctions.${functionParams.id}.amplitude`}
                    from={0}
                    to={1}
                    onChange={handleParamChange}
                />
            </div>
        </div>
    );
});
