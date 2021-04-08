import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "../../../styles/noiseChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
// import {NoiseHelp} from "../../tutorial/tooltips/NoiseHelp";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Noise} from "../../_shared/canvases/WebWorkerCanvas";
import {SinHelp} from "../../tutorial/tooltips/SinHelp";
import {ChangeFunctionState} from "../../../store/changeFunctions/types";

// import {Noise} from "../../_shared/canvases/WebWorkerCanvas";

export interface NoiseCFProps {
    tutorial: boolean
    params: any

    name: string
    functionParams: ChangeFunctionState

    onChange(value?: any, name?: string)

}

export interface NoiseCFState {

}

const fRange = [0, 5] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 5000] as [number, number];

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

const seRange = [0, 1] as [number, number];

export class NoiseCF extends React.PureComponent<NoiseCFProps, NoiseCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name.split('.').reverse()[0]]: value}, this.props.name)
    };

    render() {
        const {params, name, functionParams} = this.props;
        return (
            // <HelpTooltip component={NoiseHelp} getY={() => 27} offsetX={40}>
            <div className={"noise-change-function"}>
                <Noise
                    width={68}
                    height={58}
                    params={params}/>
                <div className={'noise-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Noise}.start`}
                        value={params.start}
                        hkLabel={'cf.hotkeysDescription.wave.noise.start'}
                        hkData1={functionParams.number}
                        name={`changeFunctions.${name}.start`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
                        precisionGain={10}
                        hkLabel={'cf.hotkeysDescription.wave.noise.f'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Noise}.f`}
                        value={params.f}
                        name={`changeFunctions.${name}.f`}
                        range={tRange}
                        onChange={this.handleParamChange}
                    />

                </div>
            </div>
            // </HelpTooltip>
        );
    }
}