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
import {ImageDataCanvas} from "../_shared/canvases/ImageData";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import "../../styles/patternSelectButton.scss"
import '../../styles/brush.scss'
import {ColorPalette} from "../ColorPalette";

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
        this.props.setBrushParams({
            ...this.props.paramsValue,
            size: value
        })
    };

    handlePatternChange = (id) => () => {
        this.props.setBrushParams({
            ...this.props.paramsValue,
            pattern: +id
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
        const {paramsConfigMap, paramsValue, patternsSelectItems} = this.props;

        return (
            <>
                <SelectButtons
                    value={paramsValue.type}
                    items={paramsConfigMap["type"].props.items}
                    onChange={this.handleTypeChange}/>
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


                <div className={'pattern-list'}>
                {paramsValue.type === EBrushType.Pattern && (<>
                    {patternsSelectItems.map(({imageData, id}, i) => {
                        const w = imageData.width;
                        const h = imageData.height;
                        // const coef  = w/h > 1 ?
                        return (
                            <>
                                <ButtonSelect
                                    className={'pattern-select-button'}
                                    width={42} height={42}
                                    onClick={this.handlePatternChange(id)}
                                    selected={+id === paramsValue.pattern}>
                                    <ImageDataCanvas
                                        width={40 * (w/h <= 1 ? w/h : 1)}
                                        height={40 * (w/h > 1 ? h/w : 1)}
                                        imageData={imageData}/>
                                </ButtonSelect>
                                {!((i + 1) % 5) ? <br/> : null}
                            </>
                        )
                    })}
                </>)}
                </div>

                {paramsValue.type !== EBrushType.Pattern && (
                    <ColorPalette/>
                )}
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