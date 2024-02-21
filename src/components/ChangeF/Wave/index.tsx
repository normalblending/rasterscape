import * as React from "react";
import "./waveChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {changeCFParams} from "../../../store/changeFunctions/actions";
import {AppState} from "../../../store";
import {AnyWaveParams, WaveParams, WaveType} from "../../../store/changeFunctions/functions/wave";
import {SinCF} from "./types/Sin";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {arrayToSelectItems} from "../../../utils/utils";
import {SawCF} from "./types/Saw";
import {NoiseCF} from "./types/Noise";
import {withTranslation, WithTranslation} from "react-i18next";
import {ChangeFunctionState} from "../../../store/changeFunctions/types";
import {Draw2dCF} from "./types/Draw";

// import {WaveHelp} from "../tutorial/tooltips/WaveHelp";

export interface WaveCFStateProps {
    params: WaveParams
    functionParams: ChangeFunctionState
}

export interface WaveCFActionProps {
    onChange(name: string, value: WaveParams)

}

export interface WaveCFOwnProps {
    name: string
}

export interface WaveCFProps extends WaveCFStateProps, WaveCFActionProps, WaveCFOwnProps, WithTranslation {

}

export interface WaveCFState {

}

export class WaveCFComponent extends React.PureComponent<WaveCFProps, WaveCFState> {

    handleParamChange = (value: AnyWaveParams) => {
        const {onChange, params, name} = this.props;
        onChange(name, {
            ...params,
            typeParams: {
                ...params.typeParams,
                [params.type]: value,
            }
        })
    };

    handleTypeChange = ({value}) => {
        const {onChange, params, name} = this.props;
        onChange(name, {
            ...params,
            type: value
        });
    };

    waveComponentsByType = {
        [WaveType.Sin]: SinCF,
        [WaveType.Saw]: SawCF,
        [WaveType.Noise]: NoiseCF,
        [WaveType.Draw]: Draw2dCF,
    };
    selectItems = arrayToSelectItems([WaveType.Sin, WaveType.Saw, WaveType.Noise, WaveType.Draw]);

    typeText = ({value}) => this.props.t('cf.wave.type.' + value);

    render() {
        const {params, name, functionParams} = this.props;

        const WaveComponent = this.waveComponentsByType[params.type];


        // console.log('WAVE RENDERR WAVE RENDERR WAVE RENDERR WAVE RENDERR WAVE RENDERR WAVE RENDERR ');

        return (
            <div className={"wave-change-function"}>
                <SelectDrop
                    name={`cf.${name}.type`}
                    className={'type-select'}
                    getText={this.typeText}
                    hkLabel={'cf.hotkeysDescription.wave.type'}
                    hkData1={functionParams.number}
                    value={params.type}
                    onChange={this.handleTypeChange}
                    items={this.selectItems}/>
                {WaveComponent &&
                <WaveComponent
                    name={name}
                    functionParams={functionParams}
                    params={params.typeParams[params.type] as any}
                    onChange={this.handleParamChange}
                />}
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<WaveCFStateProps, WaveCFOwnProps, AppState> = (state, {name}) => ({
    params: state.changeFunctions.functions[name].params as unknown as WaveParams,
    functionParams: state.changeFunctions.functions[name]
});

const mapDispatchToProps: MapDispatchToProps<WaveCFActionProps, WaveCFOwnProps> = {
    onChange: changeCFParams
};

export const WaveCF =
    connect<WaveCFStateProps, WaveCFActionProps, WaveCFOwnProps, AppState>(
        mapStateToProps,
        mapDispatchToProps
    )(withTranslation('common')(WaveCFComponent));
