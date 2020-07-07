import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {ParamConfig} from "../_shared/Params";
import {ELineType, LineParams} from "../../store/line/types";
import {setLineParams} from "../../store/line/actions";
import {createSelector} from "reselect";
import {SelectButtons} from "../_shared/buttons/SelectButtons";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {getPatternsSelectItems} from "../../store/patterns/selectors";
import {withTranslation, WithTranslation} from "react-i18next";
import '../../styles/lineTool.scss';
import {capsSelectItems, joinsSelectItems, randomSelectItems} from "../../store/line/helpers";
import {EBrushType} from "../../store/brush/types";
import {PatternsSelect} from "../PatternsSelect";

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

export interface LineProps extends LineStateProps, LineActionProps, LineOwnProps, WithTranslation {

}


const sizeRange = [0, 200] as [number, number];
const opacityRange = [0, 1] as [number, number];

class LineComponent extends React.PureComponent<LineProps> {

    handleParamChange = (data) => {
        const {value, name} = data;
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            [name]: value
        })
    };

    handlePatternChange = (pattern) => {
        const {setLineParams, paramsValue} = this.props;
        setLineParams({
            ...paramsValue,
            pattern
        })
    };

    render() {
        const {paramsConfigMap, paramsValue, t} = this.props;
        return (
            <div className='line-tool'>
                <SelectButtons
                    br={3}
                    value={paramsValue.type}
                    name={"type"}
                    getText={item => t(`lineTypes.${item.text.toLowerCase()}`)}
                    items={paramsConfigMap["type"].props.items}
                    onChange={this.handleParamChange}/>

                <div className='line-params'>
                    <ButtonNumberCF
                        pres={0}
                        valueD={0.25}
                        range={sizeRange}
                        path={"line.params.size"}
                        value={paramsValue.size}
                        name={"size"}
                        onChange={this.handleParamChange}/>

                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        precisionGain={5}
                        range={opacityRange}
                        path={"line.params.opacity"}
                        value={paramsValue.opacity}
                        name={"opacity"}
                        onChange={this.handleParamChange}/>
                    <SelectDrop
                        name={"compositeOperation"}
                        value={paramsValue.compositeOperation}
                        items={paramsConfigMap["compositeOperation"].props.items}
                        onChange={this.handleParamChange}/>
                    <SelectDrop
                        name={"random"}
                        value={paramsValue.random}
                        items={randomSelectItems}
                        onChange={this.handleParamChange}/>
                    <SelectDrop
                        name={"cap"}
                        value={paramsValue.cap}
                        items={capsSelectItems}
                        onChange={this.handleParamChange}/>
                    <SelectDrop
                        name={"join"}
                        value={paramsValue.join}
                        items={joinsSelectItems}
                        onChange={this.handleParamChange}/>
                </div>
                {paramsValue.type === ELineType.Pattern &&
                <PatternsSelect
                    value={paramsValue.pattern}
                    onChange={this.handlePatternChange}
                />
                }
            </div>
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
)(withTranslation("common")(LineComponent));