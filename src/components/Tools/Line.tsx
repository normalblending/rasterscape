import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ParamConfig, Params} from "../_shared/Params";
import {ELineType, LineParams} from "../../store/line/types";
import {setLineParams} from "../../store/line/actions";
import {createSelector} from "reselect";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {BrushParams, EBrushType} from "../../store/brush/types";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {getPatternsSelectItems} from "../../store/patterns/selectors";

export interface LineStateProps {
    paramsConfigMap: {
        [key: string]: ParamConfig
    }
    paramsConfig: ParamConfig[]
    paramsValue: LineParams
    patternsSelectItems: any[]
}

export interface LineActionProps {
    setLineParams(params: LineParams)
}

export interface LineOwnProps {

}

export interface LineProps extends LineStateProps, LineActionProps, LineOwnProps {

}


const sizeRange = [1, 200] as [number, number];
const sizeValueD = ValueD.VerticalLinear(.2);

const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

class LineComponent extends React.PureComponent<LineProps> {

    handleParamChange = (data) => {
        const {value, name} = data;
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            [name]: value
        })
    };

    render() {
        const {paramsConfigMap, paramsConfig, paramsValue, patternsSelectItems} = this.props;
        return (
            <>
                <SelectButtons
                    br={3}
                    value={paramsValue.type}
                    name={"type"}
                    items={paramsConfigMap["type"].props.items}
                    onChange={this.handleParamChange}/>
                <br/>

                <ButtonNumberCF
                    path={"line.params.size"}
                    value={paramsValue.size}
                    name={"size"}
                    onChange={this.handleParamChange}
                    range={sizeRange}
                    valueD={sizeValueD}/>

                <ButtonNumberCF
                    path={"line.params.opacity"}
                    value={paramsValue.opacity}
                    name={"opacity"}
                    onChange={this.handleParamChange}
                    range={opacityRange}
                    valueD={opacityValueD}/>
                <SelectDrop
                    name={"compositeOperation"}
                    value={paramsValue.compositeOperation}
                    items={paramsConfigMap["compositeOperation"].props.items}
                    onChange={this.handleParamChange}/>

                <br/>

                {paramsValue.type === ELineType.Pattren &&
                <SelectButtons
                    name={"pattern"}
                    value={paramsValue.pattern}
                    onChange={this.handleParamChange}
                    items={patternsSelectItems}/>}
            </>
        );
    }
};

const paramsConfigMapSelector = createSelector(
    [(state: AppState) => state.line.paramsConfig],
    (paramsConfig) => paramsConfig.reduce((res, paramConfig) => {
        res[paramConfig.name] = paramConfig;
        return res;
    }, {}));

const mapStateToProps: MapStateToProps<LineStateProps, LineOwnProps, AppState> = state => ({
    paramsConfig: state.line.paramsConfig,
    paramsConfigMap: paramsConfigMapSelector(state),
    paramsValue: state.line.params,
    patternsSelectItems: getPatternsSelectItems(state)
});

const mapDispatchToProps: MapDispatchToProps<LineActionProps, LineOwnProps> = {
    setLineParams
};

export const Line = connect<LineStateProps, LineActionProps, LineOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(LineComponent);