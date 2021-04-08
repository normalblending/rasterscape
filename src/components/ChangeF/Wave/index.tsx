import * as React from "react";
import "../../../styles/waveChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {changeCFParams} from "../../../store/changeFunctions/actions";
import {AppState} from "../../../store";
import {AnyWaveParams, WaveParams, WaveType} from "../../../store/changeFunctions/functions/wave";
import {SinCF} from "./Sin";
import {SelectDrop} from "../../_shared/buttons/complex/SelectDrop";
import {arrayToSelectItems} from "../../../utils/utils";
import {SawCF} from "./Saw";
import {NoiseCF} from "./Noise";
import {withTranslation, WithTranslation} from "react-i18next";
import {ChangeFunctionState} from "../../../store/changeFunctions/types";

// import {WaveHelp} from "../tutorial/tooltips/WaveHelp";

export interface WaveCFStateProps {

    tutorial: boolean
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

const aRange = [0, 1] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 40000] as [number, number];

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

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

    buttonWrapper = (message) => {
        const {name, tutorial} = this.props;
        return tutorial ? ({button}) => (
            <HelpTooltip
                // componentProps={{name}}
                // getY={() => 27}
                // offsetX={25}
                message={message}
            >{button}</HelpTooltip>) : null
    };

    waveComponentsByType = {
        [WaveType.Sin]: SinCF,
        [WaveType.Saw]: SawCF,
        [WaveType.Noise]: NoiseCF,
    };
    selectItems = arrayToSelectItems([WaveType.Sin, WaveType.Saw, WaveType.Noise]);

    typeText = ({value}) => this.props.t('cf.wave.type.' + value);

    render() {
        const {params, name, tutorial, functionParams} = this.props;

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
                    tutorial={tutorial}
                    params={params.typeParams[params.type]}
                    onChange={this.handleParamChange}
                />}
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<WaveCFStateProps, WaveCFOwnProps, AppState> = (state, {name}) => ({
    params: state.changeFunctions.functions[name].params,
    tutorial: state.tutorial.on,
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
