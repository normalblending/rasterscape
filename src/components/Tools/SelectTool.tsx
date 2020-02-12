import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {setSelectToolParams} from "../../store/selectTool/actions";
import {ESelectionMode, SelectToolParams} from "../../store/selectTool/types";
import {SelectDrop} from "../_shared/buttons/SelectDrop";
import {createSelector} from "reselect";
import {ParamConfig} from "../_shared/Params";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";

export interface SelectToolStateProps {

    paramsConfigMap: {
        [key: string]: ParamConfig
    }
    paramsConfig: object
    paramsValue: SelectToolParams
}

export interface SelectToolActionProps {
    setSelectToolParams(params: SelectToolParams)
}

export interface SelectToolOwnProps {

}

export interface SelectToolProps extends SelectToolStateProps, SelectToolActionProps, SelectToolOwnProps {

}
const opacityRange = [0, 1] as [number, number];
const opacityValueD = ValueD.VerticalLinear(100);

class SelectToolComponent extends React.PureComponent<SelectToolProps> {

    handleParamChange = (data) => {
        const {value, name} = data;
        const {setSelectToolParams, paramsValue} = this.props;
        setSelectToolParams({
            ...paramsValue,
            [name]: value
        })
    };

    render() {
        const {paramsValue, paramsConfigMap, paramsConfig, setSelectToolParams} = this.props;
        const {mode, curveType, ...otherParams} = paramsConfigMap;
        return (
            <>
                <SelectDrop
                    name="mode"
                    value={paramsValue.mode}
                    items={mode.props.items}
                    onChange={this.handleParamChange}/>
                {paramsValue.mode === ESelectionMode.Points &&
                <SelectDrop
                    name="curveType"
                    value={paramsValue.curveType}
                    items={curveType.props.items}
                    onChange={this.handleParamChange}/>}

                {Object.values(otherParams).map(({name, props}) => (
                    <ButtonNumberCF
                        value={paramsValue[name]}
                        name={name}
                        path={`selectTool.params.${name}`}
                        range={props.range}
                        onChange={this.handleParamChange}
                        valueD={opacityValueD}/>
                ))}

            </>
        );
    }
}


const paramsConfigMapSelector = createSelector(
    [(state: AppState) => state.selectTool.paramsConfig],
    (paramsConfig) => paramsConfig.reduce((res, paramConfig) => {
        res[paramConfig.name] = paramConfig;
        return res;
    }, {}));

const mapStateToProps: MapStateToProps<SelectToolStateProps, SelectToolOwnProps, AppState> = state => ({
    paramsConfig: state.selectTool.paramsConfig,
    paramsValue: state.selectTool.params,
    paramsConfigMap: paramsConfigMapSelector(state),
});

const mapDispatchToProps: MapDispatchToProps<SelectToolActionProps, SelectToolOwnProps> = {
    setSelectToolParams
};

export const SelectTool = connect<SelectToolStateProps, SelectToolActionProps, SelectToolOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(SelectToolComponent);