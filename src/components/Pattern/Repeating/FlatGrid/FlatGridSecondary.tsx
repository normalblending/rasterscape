import * as React from "react";
import {CrossSelectData} from "../BezierGrid/BezierGridRepeatsSVGUI";
import {ERepeatsType, RepeatsBezierGridParams, RepeatsFlatGridParams} from "../../../../store/patterns/repeating/types";
import './styles.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../../store";
import {setRepeatsParams} from "../../../../store/patterns/repeating/actions";
import {BezierPoints} from "../../../_shared/SVG/_utils";
import {Vector} from "../../../../utils/vector";
import {setStartValue} from "../../../../store/changingValues/actions";
import {getRepeatsParamsStatePathByType} from "../../../../store/patterns/repeating/helpers";
import {FlatGridRepeatsSVGUI} from "./FlatGridRepeatsSVGUI";

export interface FlatGridSecondaryStateProps {

    params: RepeatsFlatGridParams | null
}

export interface FlatGridSecondaryActionProps {
    setRepeatsParams: typeof setRepeatsParams

    setStartValue(path: string, startValue: number)

}

export interface FlatGridSecondaryOwnProps {
    patternId: string
}

export interface FlatGridSecondaryProps extends FlatGridSecondaryStateProps, FlatGridSecondaryActionProps, FlatGridSecondaryOwnProps, WithTranslation {

}

const type = ERepeatsType.FlatGrid;

export const FlatGridSecondaryComponent: React.FC<FlatGridSecondaryProps> = (props) => {

    const {setRepeatsParams, params, patternId, setStartValue} = props;

    const paramsPath = React.useMemo(() => {
        return getRepeatsParamsStatePathByType(patternId, type);
    }, [patternId]);


    const handleParamChangeFromSVG = React.useCallback((param: keyof RepeatsFlatGridParams, value) => {

        setRepeatsParams(patternId, type, {
            ...params,
            [param]: value
        });

        setStartValue(`${paramsPath}.${param}`, value);

    }, [setRepeatsParams, params, patternId, paramsPath]);


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
        <FlatGridRepeatsSVGUI
            float={gridParams.float}
            xd={gridParams.xd}
            yd={gridParams.yd}
            xOut={gridParams.xOut}
            yOut={gridParams.yOut}
            onParamChange={handleParamChangeFromSVG}
            onCrossSelect={handleCrossChangeFromSVG}
        />
    );
}


const mapStateToProps: MapStateToProps<FlatGridSecondaryStateProps, FlatGridSecondaryOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.repeating?.params?.typeParams[type] || null
});

const mapDispatchToProps: MapDispatchToProps<FlatGridSecondaryActionProps, FlatGridSecondaryOwnProps> = {
    setRepeatsParams,
    setStartValue
};

export const FlatGridSecondary = connect<FlatGridSecondaryStateProps, FlatGridSecondaryActionProps, FlatGridSecondaryOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(FlatGridSecondaryComponent));
