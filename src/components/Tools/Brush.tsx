import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushParams, EBrushType} from "../../store/brush/types";
import {setBrushParams} from "../../store/brush/actions";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
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
    setBrushParams(params: BrushParams)
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
            ...paramsValue,
            size: value
        })
    }, [setBrushParams, paramsValue]);

    const handlePatternChange = React.useCallback((pattern) => {
        setBrushParams({
            ...paramsValue,
            pattern
        })
    }, [setBrushParams, paramsValue]);

    const handleCompositeChange = React.useCallback(({value}) => {
        setBrushParams({
            ...paramsValue,
            compositeOperation: value
        })
    }, [setBrushParams, paramsValue]);

    const handleOpacityChange = React.useCallback(({value}) => {
        setBrushParams({
            ...paramsValue,
            opacity: value
        })
    }, [setBrushParams, paramsValue]);

    const handleTypeChange = React.useCallback(({value}) => {
        setBrushParams({
            ...paramsValue,
            type: value
        })
    }, [setBrushParams, paramsValue]);

    const handleParamChange = React.useCallback(({value, name}) => {
        setBrushParams({
            ...paramsValue,
            [name]: value
        })
    }, [setBrushParams, paramsValue]);

    const selectTypeText = React.useMemo(() =>
        item => t(`brushTypes.${item.text.toLowerCase()}`), [t]);

    const patternSizeHelp = React.useMemo(() =>
        ({button}) => <HelpTooltip message={t('brush.sizePattern')}>{button}</HelpTooltip>, []);
    const brushSizeHelp = React.useMemo(() =>
        ({button}) => <HelpTooltip component={BrushSizeHelp}>{button}</HelpTooltip>, []);
    const opacityHelp = React.useMemo(() =>
        ({button}) => <HelpTooltip message={t('brush.opacity')}>{button}</HelpTooltip>, []);

    return (
        <div className='brush-tool'>
            <HelpTooltip message={t('brushTypes.brushType')}>
                <SelectButtons
                    value={paramsValue.type}
                    getText={selectTypeText}
                    items={brushTypeSelectItems}
                    onChange={handleTypeChange}/>
            </HelpTooltip>

            <div className='brush-params'>

                {paramsValue.type === EBrushType.Pattern ?

                    <ButtonNumberCF
                        buttonWrapper={patternSizeHelp}
                        pres={2}
                        valueD={100}
                        precisionGain={10}
                        path={"brush.params.patternSize"}
                        value={paramsValue.patternSize}
                        name={"patternSize"}
                        onChange={handleParamChange}
                        getText={patternSizeValueText}
                        range={patternSizeRange}/>
                    :

                    <ButtonNumberCF
                        buttonWrapper={brushSizeHelp}
                        pres={0}
                        valueD={1}
                        path={"brush.params.size"}
                        value={paramsValue.size}
                        name={"size"}
                        onChange={handleSizeChange}
                        range={sizeRange}/>
                }

                <ButtonNumberCF
                    buttonWrapper={opacityHelp}
                    pres={2}
                    valueD={100}
                    precisionGain={5}
                    getText={opacityValueText}
                    path={"brush.params.opacity"}
                    value={paramsValue.opacity}
                    name={"opacity"}
                    onChange={handleOpacityChange}
                    range={opacityRange}/>

                <HelpTooltip message={t('brush.blendMode')}>
                    <SelectDrop
                        value={paramsValue.compositeOperation}
                        items={compositeOperationSelectItems}
                        onChange={handleCompositeChange}/>
                </HelpTooltip>

            </div>

            {paramsValue.type === EBrushType.Pattern &&
            <PatternsSelect
                value={paramsValue.pattern}
                onChange={handlePatternChange}
            />
            }

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