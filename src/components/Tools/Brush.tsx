import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushParams, EBrushType} from "../../store/brush/types";
import {setBrushParams} from "../../store/brush/actions";
import {ButtonNumberCF} from "../_shared/buttons/hotkeyed/ButtonNumberCF";
import {ValueD} from "../_shared/buttons/complex/ButtonNumber";
import {SelectButtons} from "../_shared/buttons/complex/SelectButtons";
import {SelectDrop} from "../_shared/buttons/complex/SelectDrop";
import "../../styles/patternSelectButton.scss"
import '../../styles/brush.scss'
import {withTranslation, WithTranslation} from "react-i18next";
import {HelpTooltip} from "../tutorial/HelpTooltip";
import {BrushSizeHelp} from "../tutorial/tooltips/BrushSizeHelp";
import {PatternsSelect} from "../PatternsSelect";
import {brushTypeSelectItems} from "../../store/brush/helpers";
import {compositeOperationSelectItems} from "../../store/compositeOperations";
import {coordHelper2} from "../Area/canvasPosition.servise";

export interface BrushStateProps {
    paramsValue: BrushParams
}

export interface BrushActionProps {
    setBrushParams(params: Partial<BrushParams>)
}

export interface BrushOwnProps {

}

export interface BrushProps extends BrushStateProps, BrushActionProps, BrushOwnProps, WithTranslation {

}

const sizeRange = [0, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(0.5);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(125);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

const opacityValueText = value => value.toFixed(2);
const patternSizeValueText = value => (value * 100).toFixed(0) + '%';


const BrushComponent: React.FunctionComponent<BrushProps> = React.memo((props) => {

    const {paramsValue, t, setBrushParams} = props;

    const handleSizeChange = React.useCallback(({value}) => {
        setBrushParams({
            size: value
        })
    }, [setBrushParams]);

    const handlePatternChange = React.useCallback((pattern) => {
        setBrushParams({
            pattern
        })
    }, [setBrushParams]);

    const handleCompositeChange = React.useCallback(({value}) => {
        setBrushParams({
            compositeOperation: value
        })
    }, [setBrushParams]);

    const handleOpacityChange = React.useCallback(({value}) => {
        setBrushParams({
            opacity: value
        })
    }, [setBrushParams]);

    const handleTypeChange = React.useCallback(({value}) => {
        setBrushParams({
            type: value
        })
    }, [setBrushParams]);

    const handleParamChange = React.useCallback(({value, name}) => {
        setBrushParams({
            [name]: value
        })
    }, [setBrushParams]);

    const selectTypeText = React.useMemo(() =>
        item => t(`brushTypes.${item.text.toLowerCase()}`), [t]);

    const compositeOperationText = React.useMemo(() => ({value}) => t('brush.compositeOperations.' + value), [t])

    return (
        <div className='brush-tool'>
            <SelectButtons
                name={'brushType'}
                hkLabel={'brush.type'}
                value={paramsValue.type}
                getText={selectTypeText}
                items={brushTypeSelectItems}
                onChange={handleTypeChange}/>

            <div className='brush-params'>

                {paramsValue.type === EBrushType.Pattern ?

                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        precisionGain={10}
                        path={"brush.params.patternSize"}
                        hkLabel={'brush.hotkeysDescription.patternSize'}
                        value={paramsValue.patternSize}
                        name={"patternSize"}
                        onChange={handleParamChange}
                        getText={patternSizeValueText}
                        range={patternSizeRange}/>
                    :

                    <ButtonNumberCF
                        pres={0}
                        valueD={1}
                        path={"brush.params.size"}
                        hkLabel={'brush.hotkeysDescription.size'}
                        value={paramsValue.size}
                        name={"size"}
                        onChange={handleSizeChange}
                        range={sizeRange}/>
                }

                <ButtonNumberCF
                    pres={2}
                    valueD={100}
                    precisionGain={5}
                    getText={opacityValueText}
                    path={"brush.params.opacity"}
                    hkByValue={false}
                    hkLabel={'brush.hotkeysDescription.opacity'}
                    value={paramsValue.opacity}
                    name={"opacity"}
                    onChange={handleOpacityChange}
                    range={opacityRange}/>

                <SelectDrop
                    getText={compositeOperationText}
                    hkLabel={'brush.hotkeysDescription.compositeOperations'}
                    value={paramsValue.compositeOperation}
                    items={compositeOperationSelectItems}
                    onChange={handleCompositeChange}/>

            </div>

            {paramsValue.type === EBrushType.Pattern && (
                <PatternsSelect
                    name={'brushPattern'}
                    hkLabel={'brush.pattern'}
                    value={paramsValue.pattern}
                    onChange={handlePatternChange}
                />
            )}

        </div>
    );
});

BrushComponent.displayName = 'BrushComponent';


const mapStateToProps: MapStateToProps<BrushStateProps, BrushOwnProps, AppState> = state => ({
    paramsValue: state.brush.params,
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setBrushParams
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BrushComponent));