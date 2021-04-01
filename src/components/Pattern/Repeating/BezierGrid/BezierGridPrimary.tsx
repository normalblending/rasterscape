import * as React from "react";
import {ButtonNumberCF} from "../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {ButtonNumberEventData} from "../../../_shared/buttons/complex/ButtonNumber";
import {ERepeatsType, RepeatsBezierGridParams} from "../../../../store/patterns/repeating/types";
import './styles.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../../store";
import {setRepeatsParams} from "../../../../store/patterns/repeating/actions";
import {ButtonHK} from "../../../_shared/buttons/hotkeyed/ButtonHK";
import {BezierPoints} from "../../../_shared/SVG/_utils";
import {setStartValue} from "../../../../store/changingValues/actions";
import {getRepeatsParamsStatePathByType} from "../../../../store/patterns/repeating/helpers";

export interface BezierGridPrimaryStateProps {

    params: RepeatsBezierGridParams | null
}

export interface BezierGridPrimaryActionProps {
    setRepeatsParams: typeof setRepeatsParams

    setStartValue(path: string, startValue: number)

}

export interface BezierGridPrimaryOwnProps {
    patternId: string
}

export interface BezierGridPrimaryProps extends BezierGridPrimaryStateProps, BezierGridPrimaryActionProps, BezierGridPrimaryOwnProps, WithTranslation {

}

export interface BezierGridPrimaryState {

}

const percentText = v => v.toFixed(0) + '%';
const minusText = v => '-' + v.toFixed(2);
const minusTextInt = v => '-' + v.toFixed(0);
const plusMinusOneText = v => '+' + (v - 0).toFixed(2);
const plusMinusOneTextInt = v => '+' + (v - 0).toFixed(0);
const fixedTextInt = v => v.toFixed(0);
const fixedText = v => v.toFixed(2);

const type = ERepeatsType.BezierGrid;

export const BezierGridPrimaryComponent: React.FC<BezierGridPrimaryProps> = (props) => {

    const {setRepeatsParams, params, patternId, setStartValue, t} = props;

    const paramsPath = React.useMemo(() => {
        return getRepeatsParamsStatePathByType(patternId, type);
    }, [patternId]);

    const handleGridParamChange = React.useCallback(({value, name}) => {
        setRepeatsParams(patternId, type, {
            ...params,
            [name]: value
        });
    }, [setRepeatsParams, params, patternId]);

    const handleBoolParamChange = React.useCallback((data) => {
        const {selected, name} = data;
        setRepeatsParams(patternId, type, {
            ...params,
            [name]: !selected
        })
    }, [setRepeatsParams, params, patternId]);

    const changeBezierPointCoordinate = React.useCallback((point: number, coordinate: 'x' | 'y', value: number) => {

        const points = [...params.bezierPoints];

        points[point][coordinate] = value;
        setRepeatsParams(patternId, type, {
            ...params,
            bezierPoints: points as BezierPoints
        });

        setStartValue(`${paramsPath}.bezierPoints.${point}.${coordinate}`, value[coordinate]);

    }, [setRepeatsParams, params, patternId, paramsPath]);

    const handleBezierPointCoordinateChange = React.useCallback((data: ButtonNumberEventData) => {
        const {name, value} = data;
        const [pointIndex, coordinate] = name.split('.');

        changeBezierPointCoordinate(+pointIndex, coordinate === 'x' ? 'x' : 'y', value);
    }, [changeBezierPointCoordinate]);

    const gridParams = params;

    return (
        <div className={'repeating-controls-grid-buttons'}>
            <div className={'repeating-controls-grid-buttons-row'}>
                <ButtonHK
                    path={`${paramsPath}.float`}
                    containerClassName={'repeating-button'}
                    name={"float"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.float'}
                    hkData1={patternId}
                    onClick={handleBoolParamChange}
                    selected={gridParams.float}
                >
                    {t('pattern.repeating.float')}
                </ButtonHK>
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={1}
                    to={Math.max(10, gridParams.xd)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.xd`}
                    name={"xd"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.xd'}
                    hkData1={patternId}
                    value={gridParams.xd}
                    getText={gridParams.float ? fixedText : fixedTextInt}
                    onChange={handleGridParamChange}
                />
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={1}
                    to={Math.max(10, gridParams.yd)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.yd`}
                    name={"yd"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.yd'}
                    hkData1={patternId}
                    value={gridParams.yd}
                    getText={gridParams.float ? fixedText : fixedTextInt}
                    onChange={handleGridParamChange}/>

            </div>

            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(3, gridParams.xn0)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.xn0`}
                    name={"xn0"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.xn0'}
                    hkData1={patternId}
                    value={gridParams.xn0}
                    getText={gridParams.float ? minusText : minusTextInt}
                    onChange={handleGridParamChange}/>
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(3, gridParams.yn0)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.yn0`}
                    name={"yn0"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.yn0'}
                    hkData1={patternId}
                    value={gridParams.yn0}
                    getText={gridParams.float ? minusText : minusTextInt}
                    onChange={handleGridParamChange}/>
            </div>

            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(10, gridParams.xn1)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.xn1`}
                    name={"xn1"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.xn1'}
                    hkData1={patternId}
                    value={gridParams.xn1}
                    getText={gridParams.float ? plusMinusOneText : plusMinusOneTextInt}
                    onChange={handleGridParamChange}/>
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(10, gridParams.yn1)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.yn1`}
                    name={"yn1"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.yn1'}
                    hkData1={patternId}
                    value={gridParams.yn1}
                    getText={gridParams.float ? plusMinusOneText : plusMinusOneTextInt}
                    onChange={handleGridParamChange}/>
            </div>
            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.0.x`}
                    name={"0.x"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={0}
                    hkData3={'x'}
                    value={gridParams.bezierPoints[0].x}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[0].x)}
                    to={Math.max(1100, gridParams.bezierPoints[0].x)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.0.y`}
                    name={"0.y"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={0}
                    hkData3={'y'}
                    value={gridParams.bezierPoints[0].y}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[0].x)}
                    to={Math.max(1100, gridParams.bezierPoints[0].x)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
            </div>
            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.1.x`}
                    name={"1.x"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={1}
                    hkData3={'x'}
                    value={gridParams.bezierPoints[1].x}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[1].x)}
                    to={Math.max(1100, gridParams.bezierPoints[1].x)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.1.y`}
                    name={"1.y"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={1}
                    hkData3={'y'}
                    value={gridParams.bezierPoints[1].y}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[1].y)}
                    to={Math.max(1100, gridParams.bezierPoints[1].y)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
            </div>
            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.2.x`}
                    name={"2.x"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={2}
                    hkData3={'x'}
                    value={gridParams.bezierPoints[2].x}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[1].y)}
                    to={Math.max(1100, gridParams.bezierPoints[1].y)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.2.y`}
                    name={"2.y"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={2}
                    hkData3={'y'}
                    value={gridParams.bezierPoints[2].y}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[2].y)}
                    to={Math.max(1100, gridParams.bezierPoints[2].y)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
            </div>
            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.3.x`}
                    name={"3.x"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={3}
                    hkData3={'x'}
                    value={gridParams.bezierPoints[3].x}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[3].x)}
                    to={Math.max(1100, gridParams.bezierPoints[3].x)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
                <ButtonNumberCF
                    className={'repeating-button-number'}
                    path={`${paramsPath}.bezierPoints.3.y`}
                    name={"3.y"}
                    hkLabel={'pattern.hotkeysDescription.repeating.bezier.bezierPoints'}
                    hkData1={patternId}
                    hkData2={3}
                    hkData3={'y'}
                    value={gridParams.bezierPoints[3].y}
                    pres={0}
                    from={Math.min(-1000, gridParams.bezierPoints[3].y)}
                    to={Math.max(1100, gridParams.bezierPoints[3].y)}
                    getText={percentText}
                    onChange={handleBezierPointCoordinateChange}/>
            </div>
        </div>
    );
}


const mapStateToProps: MapStateToProps<BezierGridPrimaryStateProps, BezierGridPrimaryOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.repeating?.params?.typeParams[type]
});

const mapDispatchToProps: MapDispatchToProps<BezierGridPrimaryActionProps, BezierGridPrimaryOwnProps> = {
    setRepeatsParams,
    setStartValue
};

export const BezierGridPrimary = connect<BezierGridPrimaryStateProps, BezierGridPrimaryActionProps, BezierGridPrimaryOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BezierGridPrimaryComponent));