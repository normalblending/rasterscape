import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {setSelectToolParams} from "../../store/selectTool/actions";
import {ESelectionMode, SelectToolParams} from "../../store/selectTool/types";
import {SelectDrop} from "../_shared/buttons/complex/SelectDrop";
import {createSelector} from "reselect";
import {ParamConfig} from "../_shared/Params";
import {ValueD} from "../_shared/buttons/complex/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/hotkeyed/ButtonNumberCF";
import {SelectButtons} from "../_shared/buttons/complex/SelectButtons";
import {withTranslation, WithTranslation} from "react-i18next";
import '../../styles/selectTool.scss';

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

export interface SelectToolProps extends SelectToolStateProps, SelectToolActionProps, SelectToolOwnProps, WithTranslation {

}

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
        const {paramsValue, paramsConfigMap, t} = this.props;
        const {mode, curveType, ...otherParams} = paramsConfigMap;
        return (
            <div className='select-tool'>

                <SelectButtons
                    hkLabel='select mode'
                    name="mode"
                    value={paramsValue.mode}
                    getText={item => t(`selectTypes.${item.text.toLowerCase()}`)}
                    items={mode.props.items}
                    onChange={this.handleParamChange}/>

                <div className={'select-tool-params'}>
                    {paramsValue.mode === ESelectionMode.Points &&
                    <SelectDrop
                        hkLabel={'select curve type'}
                        name="curveType"
                        value={paramsValue.curveType}
                        items={curveType.props.items}
                        onChange={this.handleParamChange}/>}

                    {Object.values(otherParams).map(({name, props}) => (
                        <ButtonNumberCF
                            value={paramsValue[name]}
                            name={name}
                            path={`selectTool.params.${name}`}
                            hkLabel={'select curve type param'}
                            range={props.range}
                            pres={2}
                            valueD={50}
                            onChange={this.handleParamChange}/>
                    ))}

                </div>
            </div>
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
)(withTranslation("common")(SelectToolComponent));