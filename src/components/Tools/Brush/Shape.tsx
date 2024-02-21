import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {setShapeBrushParams} from "../../../store/brush/actions";
import {BrushShapeParams, EBrushType} from "../../../store/brush/types";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {compositeOperationSelectItems} from "../../../store/compositeOperations";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {WithTranslation, withTranslation} from "react-i18next";

export interface ShapeBrushStateProps {
    params: BrushShapeParams
}

export interface ShapeBrushActionProps {
    setShapeBrushParams: typeof setShapeBrushParams
}

export interface ShapeBrushOwnProps {
}

export interface ShapeBrushProps extends ShapeBrushStateProps, ShapeBrushActionProps, ShapeBrushOwnProps, WithTranslation {

}

const sizeRange = [0, 500] as [number, number];
const sizeValueD = ValueD.VerticalLinear(0.5);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(125);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

const opacityValueText = value => value.toFixed(2);
const patternSizeValueText = value => (value * 100).toFixed(0) + '%';

const ShapeBrushComponent: React.FC<ShapeBrushProps> = (props) => {

    const {params, t, setShapeBrushParams} = props;

    const handleSizeChange = React.useCallback(({value}) => {
        setShapeBrushParams({
            size: value
        })
    }, [setShapeBrushParams]);


    const handleCompositeChange = React.useCallback(({value}) => {
        setShapeBrushParams({
            compositeOperation: value
        })
    }, [setShapeBrushParams]);

    const handleOpacityChange = React.useCallback(({value}) => {
        setShapeBrushParams({
            opacity: value
        })
    }, [setShapeBrushParams]);

    const handleParamChange = React.useCallback(({value, name}) => {
        setShapeBrushParams({
            [name]: value
        })
    }, [setShapeBrushParams]);

    const compositeOperationText = React.useMemo(() => ({value}) => t('brush.compositeOperations.' + value), [t])

    return (
        <>
            <div className='brush-params'>

                <ButtonNumberCF
                    pres={0}
                    // valueD={100}
                    // precisionGain={0}
                    path={`brush.params.paramsByType.${EBrushType.Shape}.size`}
                    hkLabel={'brush.hotkeysDescription.size'}
                    value={params.size}
                    name={"size"}
                    onChange={handleParamChange}
                    from={0}
                    to={500}
                />

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={5}
                    getText={opacityValueText}
                    path={`brush.params.paramsByType.${EBrushType.Shape}.opacity`}
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
        </>
    );
};

const mapStateToProps: MapStateToProps<ShapeBrushStateProps, {}, AppState> = state => ({
    params: state.brush.params.paramsByType[EBrushType.Shape],
});

const mapDispatchToProps: MapDispatchToProps<ShapeBrushActionProps, ShapeBrushOwnProps> = {
    setShapeBrushParams
};

export const ShapeBrush = connect<ShapeBrushStateProps, ShapeBrushActionProps, ShapeBrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(ShapeBrushComponent));

const dfjkkdfdg = () => {

}
