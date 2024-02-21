import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {setPatternBrushParams} from "../../../store/brush/actions";
import {BrushPatternParams, EBrushType} from "../../../store/brush/types";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {compositeOperationSelectItems} from "../../../store/compositeOperations";
import {PatternsSelect} from "../../PatternsSelect";
import {WithTranslation, withTranslation} from "react-i18next";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";

export interface PatternBrushStateProps {
    params: BrushPatternParams
}

export interface PatternBrushActionProps {
    setPatternBrushParams: typeof setPatternBrushParams
}

export interface PatternBrushOwnProps {

}

export interface PatternBrushProps extends PatternBrushStateProps, PatternBrushActionProps, PatternBrushOwnProps, WithTranslation {

}

const sizeRange = [0, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(0.5);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(125);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

const opacityValueText = value => value.toFixed(2);
const patternSizeValueText = value => (value * 100).toFixed(0) + '%';

const PatternBrushComponent: React.FC<PatternBrushProps> = (props) => {

    const {params, t, setPatternBrushParams} = props;

    const handleSizeChange = React.useCallback(({value}) => {
        setPatternBrushParams({
            size: value
        })
    }, [setPatternBrushParams]);

    const handlePatternChange = React.useCallback((patternId) => {
        setPatternBrushParams({patternId});
    }, [setPatternBrushParams]);

    const handleCompositeChange = React.useCallback(({value}) => {
        setPatternBrushParams({
            compositeOperation: value
        })
    }, [setPatternBrushParams]);

    const handleOpacityChange = React.useCallback(({value}) => {
        setPatternBrushParams({
            opacity: value
        })
    }, [setPatternBrushParams]);

    const handleParamChange = React.useCallback(({value, name}) => {
        setPatternBrushParams({
            [name]: value
        })
    }, [setPatternBrushParams]);

    const compositeOperationText = React.useMemo(() => ({value}) => t('brush.compositeOperations.' + value), [t])

    return (
        <>
            <div className='brush-params'>

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={10}
                    path={`brush.params.paramsByType.${EBrushType.Pattern}.size`}
                    hkLabel={'brush.hotkeysDescription.patternSize'}
                    value={params.size}
                    name={"size"}
                    onChange={handleParamChange}
                    getText={patternSizeValueText}
                    range={patternSizeRange}/>

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={5}
                    getText={opacityValueText}
                    path={`brush.params.paramsByType.${EBrushType.Pattern}.opacity`}
                    hkByValue={false}
                    hkLabel={'brush.hotkeysDescription.opacity'}
                    value={params.opacity}
                    name={"opacity"}
                    onChange={handleOpacityChange}
                    range={opacityRange}/>

                <SelectDrop
                    getText={compositeOperationText}
                    hkLabel={'brush.hotkeysDescription.compositeOperations'}
                    value={params.compositeOperation}
                    items={compositeOperationSelectItems}
                    onChange={handleCompositeChange}/>

            </div>

            <PatternsSelect
                name={'brushPattern'}
                hkLabel={'brush.pattern'}
                value={params.patternId}
                onChange={handlePatternChange}
            />
        </>
    );
};

const mapStateToProps: MapStateToProps<PatternBrushStateProps, {}, AppState> = state => ({
    params: state.brush.params.paramsByType[EBrushType.Pattern],
});

const mapDispatchToProps: MapDispatchToProps<PatternBrushActionProps, PatternBrushOwnProps> = {
    setPatternBrushParams
};

export const PatternBrush = connect<PatternBrushStateProps, PatternBrushActionProps, PatternBrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(PatternBrushComponent));
