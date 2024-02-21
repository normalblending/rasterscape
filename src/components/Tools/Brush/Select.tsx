import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {setSelectBrushParams} from "../../../store/brush/actions";
import {BrushSelectParams, EBrushType} from "../../../store/brush/types";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {compositeOperationSelectItems} from "../../../store/compositeOperations";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {WithTranslation, withTranslation} from "react-i18next";

export interface SelectBrushStateProps {
    params: BrushSelectParams
}

export interface SelectBrushActionProps {
    setSelectBrushParams: typeof setSelectBrushParams
}

export interface SelectBrushOwnProps {

}

export interface SelectBrushProps extends SelectBrushStateProps, SelectBrushActionProps, SelectBrushOwnProps, WithTranslation {

}

const sizeRange = [0, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(0.5);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(125);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

const opacityValueText = value => value.toFixed(2);
const patternSizeValueText = value => (value * 100).toFixed(0) + '%';

const SelectBrushComponent: React.FC<SelectBrushProps> = (props) => {

    const {params, t, setSelectBrushParams} = props;

    const handleSizeChange = React.useCallback(({value}) => {
        setSelectBrushParams({
            size: value
        })
    }, [setSelectBrushParams]);


    const handleCompositeChange = React.useCallback(({value}) => {
        setSelectBrushParams({
            compositeOperation: value
        })
    }, [setSelectBrushParams]);

    const handleOpacityChange = React.useCallback(({value}) => {
        setSelectBrushParams({
            opacity: value
        })
    }, [setSelectBrushParams]);

    const handleParamChange = React.useCallback(({value, name}) => {
        setSelectBrushParams({
            [name]: value
        })
    }, [setSelectBrushParams]);

    const compositeOperationText = React.useMemo(() => ({value}) => t('brush.compositeOperations.' + value), [t])

    return (
        <>
            <div className='brush-params'>

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={10}
                    path={`brush.params.paramsByType.${EBrushType.Select}.size`}
                    hkLabel={'brush.hotkeysDescription.size'} //!
                    value={params.size}
                    name={"size"}
                    onChange={handleParamChange}
                    getText={patternSizeValueText}
                    range={patternSizeRange}/>

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={5}
                    range={opacityRange}
                    path={`brush.params.paramsByType.${EBrushType.Select}.opacity`}
                    hkLabel={'brush.hotkeysDescription.opacity'}//!
                    value={params.opacity}
                    name={"opacity"}
                    getText={opacityValueText}
                    hkByValue={false}
                    onChange={handleOpacityChange}
                />

                <SelectDrop
                    getText={compositeOperationText}
                    hkLabel={'brush.hotkeysDescription.compositeOperations'}
                    value={params.compositeOperation}
                    items={compositeOperationSelectItems}
                    onChange={handleCompositeChange}/>

            </div>

        </>
    );
};

const mapStateToProps: MapStateToProps<SelectBrushStateProps, {}, AppState> = state => ({
    params: state.brush.params.paramsByType[EBrushType.Select],
});

const mapDispatchToProps: MapDispatchToProps<SelectBrushActionProps, SelectBrushOwnProps> = {
    setSelectBrushParams
};

export const SelectBrush = connect<SelectBrushStateProps, SelectBrushActionProps, SelectBrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(SelectBrushComponent));
