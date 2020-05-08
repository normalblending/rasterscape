import * as React from "react";
import "../../../styles/waveChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {changeCFParams} from "../../../store/changeFunctions/actions";
import {AppState} from "../../../store";
import {AnyWaveParams, WaveParams, WaveType} from "../../../store/changeFunctions/functions/wave";
import {SinCF} from "./Sin";
import {SelectDrop} from "bbuutoonnss";
import {arrayToSelectItems} from "../../../utils/utils";
import {SawCF} from "./Saw";
import {NoiseCF} from "./Noise";

// import {WaveHelp} from "../tutorial/tooltips/WaveHelp";

export interface WaveCFStateProps {

    tutorial: boolean
    params: WaveParams
}

export interface WaveCFActionProps {
    onChange(name: string, value: WaveParams)

}

export interface WaveCFOwnProps {
    name: string
}

export interface WaveCFProps extends WaveCFStateProps, WaveCFActionProps, WaveCFOwnProps {

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


    render() {
        const {params, name, tutorial} = this.props;

        const WaveComponent = this.waveComponentsByType[params.type];
        return (
            // <HelpTooltip component={WaveHelp} getY={() => 27} offsetX={40}>
            <div className={"wave-change-function"}>
                <SelectDrop
                    className={'type-select'}
                    value={params.type}
                    onChange={this.handleTypeChange}
                    items={this.selectItems}/>
                {WaveComponent &&
                <WaveComponent
                    name={name}
                    tutorial={tutorial}
                    params={params.typeParams[params.type]}
                    onChange={this.handleParamChange}
                />}
            </div>
            // </HelpTooltip>
        );
    }
}

const mapStateToProps: MapStateToProps<WaveCFStateProps, WaveCFOwnProps, AppState> = (state, {name}) => ({
    params: state.changeFunctions.functions[name].params,
    tutorial: state.tutorial.on
});

const mapDispatchToProps: MapDispatchToProps<WaveCFActionProps, WaveCFOwnProps> = {
    onChange: changeCFParams
};

export const WaveCF = connect<WaveCFStateProps, WaveCFActionProps, WaveCFOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(WaveCFComponent);
