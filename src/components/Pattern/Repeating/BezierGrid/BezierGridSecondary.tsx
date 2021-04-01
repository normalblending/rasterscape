import * as React from "react";
import {BezierGridRepeatsSVGUI, CrossSelectData} from "./BezierGridRepeatsSVGUI";
import {ERepeatsType, RepeatsBezierGridParams} from "../../../../store/patterns/repeating/types";
import './styles.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../../store";
import {setRepeatsParams} from "../../../../store/patterns/repeating/actions";
import {BezierPoints} from "../../../_shared/SVG/_utils";
import {Vector} from "../../../../utils/vector";
import {setStartValue} from "../../../../store/changingValues/actions";
import {getRepeatsParamsStatePathByType} from "../../../../store/patterns/repeating/helpers";

export interface BezierGridSecondaryStateProps {

    params: RepeatsBezierGridParams | null
}

export interface BezierGridSecondaryActionProps {
    setRepeatsParams: typeof setRepeatsParams

    setStartValue(path: string, startValue: number)

}

export interface BezierGridSecondaryOwnProps {
    patternId: string
}

export interface BezierGridSecondaryProps extends BezierGridSecondaryStateProps, BezierGridSecondaryActionProps, BezierGridSecondaryOwnProps, WithTranslation {

}

const type = ERepeatsType.BezierGrid;

export const BezierGridSecondaryComponent: React.FC<BezierGridSecondaryProps> = (props) => {

    const {setRepeatsParams, params, patternId, setStartValue} = props;

    const paramsPath = React.useMemo(() => {
        return getRepeatsParamsStatePathByType(patternId, type);
    }, [patternId]);


    const handleGridParamChangeFromSVG = React.useCallback((param: keyof RepeatsBezierGridParams, value) => {

        setRepeatsParams(patternId, type, {
            ...params,
            [param]: value
        });

        setStartValue(`${paramsPath}.${param}`, value);

    }, [setRepeatsParams, params, patternId, paramsPath]);

    const changeBezierPoint = React.useCallback((point: number, value: Vector) => {
        const points = [...params.bezierPoints];

        points[point] = value;
        setRepeatsParams(patternId, type, {
            ...params,
            bezierPoints: points as BezierPoints
        });

        setStartValue(`${paramsPath}.bezierPoints.${point}.x`, value.x);
        setStartValue(`${paramsPath}.bezierPoints.${point}.y`, value.y);
    }, [setRepeatsParams, params, patternId, setStartValue, paramsPath]);

    const handleCrossChangeFromSVG = React.useCallback((data: CrossSelectData) => {
        const {
            xn0,
            yn0,
            xn1,
            yn1,
        } = data;


        setRepeatsParams(patternId, type, {
            ...params,
            xn0: xn0 !== undefined ? xn0 : params.xn0,
            yn0: yn0 !== undefined ? yn0 : params.yn0,
            xn1: xn1 !== undefined ? xn1 : params.xn1,
            yn1: yn1 !== undefined ? yn1 : params.yn1,
        });

        xn0 !== undefined && setStartValue(`${paramsPath}.xn1`, xn0);
        yn0 !== undefined && setStartValue(`${paramsPath}.xn1`, yn0);
        xn1 !== undefined && setStartValue(`${paramsPath}.xn1`, xn1);
        yn1 !== undefined && setStartValue(`${paramsPath}.xn1`, yn1);

    }, [setRepeatsParams, params, patternId, setStartValue, paramsPath]);

    const gridParams = params;

    return (
        <BezierGridRepeatsSVGUI
            float={gridParams.float}
            xd={gridParams.xd}
            yd={gridParams.yd}
            xn0={gridParams.xn0}
            yn0={gridParams.yn0}
            xn1={gridParams.xn1}
            yn1={gridParams.yn1}
            value={gridParams.bezierPoints}
            onParamChange={handleGridParamChangeFromSVG}
            onPointChange={changeBezierPoint}
            onCrossSelect={handleCrossChangeFromSVG}
        />
    );
}


const mapStateToProps: MapStateToProps<BezierGridSecondaryStateProps, BezierGridSecondaryOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.repeating?.params?.typeParams[type] || null
});

const mapDispatchToProps: MapDispatchToProps<BezierGridSecondaryActionProps, BezierGridSecondaryOwnProps> = {
    setRepeatsParams,
    setStartValue
};

export const BezierGridSecondary = connect<BezierGridSecondaryStateProps, BezierGridSecondaryActionProps, BezierGridSecondaryOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BezierGridSecondaryComponent));