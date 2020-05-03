import * as React from "react";
import {ParamConfig, Params} from "../../_shared/Params";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/sawChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {SawWave} from "../../_shared/canvases/SawWave";
import {SinWave} from "../../_shared/canvases/SinWave";

// import {toFixed2} from "../../utils/utils";

export interface SawCFProps {
    tutorial: boolean
    params: any

    name: string

    onChange(value?: any, name?: string)

}

export interface SawCFState {

}


const tRange = [0, 40000] as [number, number];
const tValueD = ValueD.VerticalLinear(.05);
const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

export class SawCF extends React.PureComponent<SawCFProps, SawCFState> {

    shouldComponentUpdate(nextProps: Readonly<SawCFProps>, nextState: Readonly<SawCFState>, nextContext: any): boolean {
        return nextProps.params !== this.props.params
    }

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    buttonWrapper = (message) => {
        const {tutorial} = this.props;
        return tutorial ? button => (
            <HelpTooltip
                // secondaryMessage={message === 'period' &&
                // <span>negative value for movement<br/> in the opposite direction</span>}
                message={message}>{button}</HelpTooltip>) : null
    };

    render() {
        const {params, onChange, name} = this.props;
        return (
            <div className={"saw-change-function"}>
                <SawWave
                    W={68}
                    H={58}
                    start={params.start}
                    end={params.end}
                    t={params.t}
                />
                <div className={'saw-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        buttonWrapper={this.buttonWrapper('min')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.start`}
                        value={params.start}
                        name={"start"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        buttonWrapper={this.buttonWrapper('max')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.end`}
                        value={params.end}
                        name={"end"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        precision={0}
                        valueD={1 / 64}
                        precisionGain={10}
                        buttonWrapper={this.buttonWrapper('period')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.t`}
                        value={params.t}
                        name={"t"}
                        range={tRange}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}