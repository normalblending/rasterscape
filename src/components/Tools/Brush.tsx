import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushParams, EBrushType} from "../../store/brush/types";
import {setBrushParams} from "../../store/brush/actions";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {createSelector} from "reselect";
import "../../styles/patternSelectButton.scss"
import '../../styles/brush.scss'
import {withTranslation, WithTranslation} from "react-i18next";
import {HelpTooltip} from "../tutorial/HelpTooltip";
import {BrushSizeHelp} from "../tutorial/tooltips/BrushSizeHelp";
import {PatternsSelect} from "../PatternsSelect";

export interface BrushStateProps {
    paramsConfigMap: {
        [key: string]: ParamConfig
    }
    paramsConfig: ParamConfig[]
    paramsValue: BrushParams
    tutorial: boolean
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


class BrushComponent extends React.PureComponent<BrushProps> {

    handleSizeChange = ({value}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            size: value
        })
    };

    handlePatternChange = (pattern) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            pattern
        })
    };

    handleCompositeChange = ({value}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            compositeOperation: value
        })
    };

    handleOpacityChange = ({value}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            opacity: value
        })
    };

    handleTypeChange = ({value}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            type: value
        })
    };

    handleParamChange = ({value, name}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            [name]: value
        })
    };

    render() {
        const {paramsConfigMap, paramsValue, t, tutorial} = this.props;

        console.log(paramsConfigMap["type"].props.items);
        return (
            <div className='brush-tool'>
                <SelectButtons
                    value={paramsValue.type}
                    getText={item => t(`brushTypes.${item.text.toLowerCase()}`)}
                    items={paramsConfigMap["type"].props.items}
                    onChange={this.handleTypeChange}/>

                <div className='brush-params'>

                    {paramsValue.type === EBrushType.Pattern ?

                        <ButtonNumberCF
                            buttonWrapper={
                                tutorial
                                    ? button => <HelpTooltip message={'brush size pattern'}>{button}</HelpTooltip>
                                    : null}
                            pres={2}
                            valueD={62.5}
                            precisionGain={10}
                            path={"brush.params.patternSize"}
                            value={paramsValue.patternSize}
                            name={"patternSize"}
                            onChange={this.handleParamChange}
                            getText={patternSizeValueText}
                            range={patternSizeRange}/>
                        :

                        <ButtonNumberCF
                            buttonWrapper={
                                tutorial
                                    ? button => <HelpTooltip component={BrushSizeHelp}>{button}</HelpTooltip>
                                    : null}
                            pres={0}
                            valueD={0.25}
                            path={"brush.params.size"}
                            value={paramsValue.size}
                            name={"size"}
                            onChange={this.handleSizeChange}
                            range={sizeRange}/>
                    }

                    <ButtonNumberCF
                        buttonWrapper={
                            tutorial
                                ? button => <HelpTooltip message={'opacity'}>{button}</HelpTooltip>
                                : null}
                        pres={2}
                        valueD={100}
                        precisionGain={5}
                        getText={opacityValueText}
                        path={"brush.params.opacity"}
                        value={paramsValue.opacity}
                        name={"opacity"}
                        onChange={this.handleOpacityChange}
                        range={opacityRange}/>

                    <HelpTooltip message={'blend mode'}>
                        <SelectDrop
                            value={paramsValue.compositeOperation}
                            items={paramsConfigMap["compositeOperation"].props.items}
                            onChange={this.handleCompositeChange}/>
                    </HelpTooltip>

                </div>

                {paramsValue.type === EBrushType.Pattern &&
                <PatternsSelect
                    value={paramsValue.pattern}
                    onChange={this.handlePatternChange}
                />
                }


                {/*{paramsValue.type !== EBrushType.Pattern && (*/}
                {/*    <ColorPalette/>*/}
                {/*)}*/}
            </div>
        );
    }
}

const paramsConfigMapSelector = createSelector(
    [(state: AppState) => state.brush.paramsConfig],
    (paramsConfig) => paramsConfig.reduce((res, paramConfig) => {
        res[paramConfig.name] = paramConfig;
        return res;
    }, {}));

const mapStateToProps: MapStateToProps<BrushStateProps, BrushOwnProps, AppState> = state => ({
    paramsConfig: state.brush.paramsConfig,
    paramsConfigMap: paramsConfigMapSelector(state),
    paramsValue: state.brush.params,
    tutorial: state.tutorial.on
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setBrushParams
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(BrushComponent));