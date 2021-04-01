import * as React from "react";
import {ButtonNumberCF} from "../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {ERepeatsType, RepeatsFlatGridParams} from "../../../../store/patterns/repeating/types";
import './styles.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../../store";
import {setRepeatsParams} from "../../../../store/patterns/repeating/actions";
import {ButtonHK} from "../../../_shared/buttons/hotkeyed/ButtonHK";
import {setStartValue} from "../../../../store/changingValues/actions";
import {getRepeatsParamsStatePathByType} from "../../../../store/patterns/repeating/helpers";

export interface FlatGridPrimaryStateProps {

    params: RepeatsFlatGridParams | null
}

export interface FlatGridPrimaryActionProps {
    setRepeatsParams: typeof setRepeatsParams

    setStartValue(path: string, startValue: number)

}

export interface FlatGridPrimaryOwnProps {
    patternId: string
}

export interface FlatGridPrimaryProps extends FlatGridPrimaryStateProps, FlatGridPrimaryActionProps, FlatGridPrimaryOwnProps, WithTranslation {

}

export interface FlatGridPrimaryState {

}

const percentText = v => v.toFixed(0) + '%';
const minusText = v => '-' + v.toFixed(2);
const minusTextInt = v => '-' + v.toFixed(0);
const plusMinusOneText = v => '+' + (v - 0).toFixed(2);
const plusMinusOneTextInt = v => '+' + (v - 0).toFixed(0);
const fixedTextInt = v => v.toFixed(0);
const fixedText = v => v.toFixed(2);

const type = ERepeatsType.FlatGrid;

export const FlatGridPrimaryComponent: React.FC<FlatGridPrimaryProps> = (props) => {

    const {setRepeatsParams, params, patternId, setStartValue, t} = props;

    const paramsPath = React.useMemo(() => {
        return getRepeatsParamsStatePathByType(patternId, type);
    }, [patternId]);

    const handleParamChange = React.useCallback(({value, name}) => {
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

    const gridParams = params;

    return (
        <div className={'repeating-controls-grid-buttons'}>
            <div className={'repeating-controls-grid-buttons-row'}>
                <ButtonHK
                    path={`${paramsPath}.float`}
                    containerClassName={'repeating-button'}
                    name={"float"}
                    hkLabel={'pattern.hotkeysDescription.repeating.flat.float'}
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
                    hkLabel={'pattern.hotkeysDescription.repeating.flat.xd'}
                    hkData1={patternId}
                    value={gridParams.xd}
                    getText={gridParams.float ? fixedText : fixedTextInt}
                    onChange={handleParamChange}
                />
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={1}
                    to={Math.max(10, gridParams.yd)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.yd`}
                    name={"yd"}
                    hkLabel={'pattern.hotkeysDescription.repeating.flat.yd'}
                    hkData1={patternId}
                    value={gridParams.yd}
                    getText={gridParams.float ? fixedText : fixedTextInt}
                    onChange={handleParamChange}/>

            </div>

            <div className={'repeating-controls-grid-buttons-row'}>

                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(3, gridParams.xOut)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.xOut`}
                    name={"xOut"}
                    hkLabel={'pattern.hotkeysDescription.repeating.flat.xn0'}
                    hkData1={patternId}
                    value={gridParams.xOut}
                    getText={gridParams.float ? minusText : minusTextInt}
                    onChange={handleParamChange}/>
                <ButtonNumberCF
                    pres={gridParams.float ? 2 : 1}
                    from={0}
                    to={Math.max(3, gridParams.yOut)}
                    className={'repeating-button-number'}
                    integer={!gridParams.float}
                    path={`${paramsPath}.yOut`}
                    name={"yOut"}
                    hkLabel={'pattern.hotkeysDescription.repeating.flat.yn0'}
                    hkData1={patternId}
                    value={gridParams.yOut}
                    getText={gridParams.float ? minusText : minusTextInt}
                    onChange={handleParamChange}/>
            </div>

        </div>
    );
}


const mapStateToProps: MapStateToProps<FlatGridPrimaryStateProps, FlatGridPrimaryOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.repeating?.params?.typeParams[type]
});

const mapDispatchToProps: MapDispatchToProps<FlatGridPrimaryActionProps, FlatGridPrimaryOwnProps> = {
    setRepeatsParams,
    setStartValue
};

export const FlatGridPrimary = connect<FlatGridPrimaryStateProps, FlatGridPrimaryActionProps, FlatGridPrimaryOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(FlatGridPrimaryComponent));