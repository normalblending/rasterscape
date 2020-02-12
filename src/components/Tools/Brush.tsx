import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushParams, EBrushType} from "../../store/brush/types";
import {setBrushParams} from "../../store/brush/actions";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {getPatternsSelectItems} from "../../store/patterns/selectors";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {createSelector} from "reselect";

export interface BrushStateProps {
    paramsConfigMap: {
        [key: string]: ParamConfig
    }
    paramsConfig: ParamConfig[]
    paramsValue: BrushParams
    patternsSelectItems: any[]
}

export interface BrushActionProps {
    setBrushParams(params: BrushParams)
}

export interface BrushOwnProps {

}

export interface BrushProps extends BrushStateProps, BrushActionProps, BrushOwnProps {

}

const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.2);

const patternSizeRange = [0, 5] as [number, number];
const patternSizeValueD = ValueD.VerticalLinear(200);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

class BrushComponent extends React.PureComponent<BrushProps> {

    handleSizeChange = ({value}) => {
        console.log(value);
        this.props.setBrushParams({
            ...this.props.paramsValue,
            size: value
        })
    };

    handlePatternChange = ({value}) => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            pattern: +value
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


        const {paramsConfig, paramsConfigMap, paramsValue, setBrushParams, patternsSelectItems} = this.props;

        return (
            <>
                <SelectButtons
                    value={paramsValue.type}
                    items={paramsConfigMap["type"].props.items}
                    onChange={this.handleTypeChange}/>
                <br/>


                {paramsValue.type === EBrushType.Pattern ?
                    <ButtonNumberCF
                        path={"brush.params.patternSize"}
                        value={paramsValue.patternSize}
                        name={"patternSize"}
                        onChange={this.handleParamChange}
                        range={patternSizeRange}
                        valueD={patternSizeValueD}/> :
                    <ButtonNumberCF
                        path={"brush.params.size"}
                        value={paramsValue.size}
                        name={"size"}
                        onChange={this.handleSizeChange}
                        range={sizeRange}
                        valueD={sizeValueD}/>}

                <ButtonNumberCF
                    path={"brush.params.opacity"}
                    value={paramsValue.opacity}
                    name={"opacity"}
                    onChange={this.handleOpacityChange}
                    range={opacityRange}
                    valueD={opacityValueD}/>
                <SelectDrop
                    value={paramsValue.compositeOperation}
                    items={paramsConfigMap["compositeOperation"].props.items}
                    onChange={this.handleCompositeChange}/>

                <br/>

                {paramsValue.type === EBrushType.Pattern &&
                <SelectButtons
                    value={paramsValue.pattern}
                    onChange={this.handlePatternChange}
                    items={patternsSelectItems}/>}
            </>
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
    patternsSelectItems: getPatternsSelectItems(state)
});

const mapDispatchToProps: MapDispatchToProps<BrushActionProps, BrushOwnProps> = {
    setBrushParams
};

export const Brush = connect<BrushStateProps, BrushActionProps, BrushOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(BrushComponent);