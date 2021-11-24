import * as React from "react";
import {ButtonNumberCF} from "../../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "../../../../styles/sawChangeFunction.scss";
import {WaveType} from "../../../../store/changeFunctions/functions/wave";
import {Saw} from "../../../_shared/canvases/WebWorkerCanvas";
import {ChangeFunctionState} from "../../../../store/changeFunctions/types";

export interface SawCFProps {
    params: any

    name: string

    functionParams: ChangeFunctionState

    onChange(value?: any, name?: string)

}

export interface SawCFState {

}


const tRange = [0, 40000] as [number, number];
const seRange = [0, 1] as [number, number];

export class SawCF extends React.PureComponent<SawCFProps, SawCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name.split('.').reverse()[0]]: value}, this.props.name)
    };

    render() {
        const {params, functionParams, name} = this.props;
        return (
            <div className={"saw-change-function"}>
                <Saw
                    width={68}
                    height={58}
                    params={params}
                />
                <div className={'saw-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        hkLabel={'cf.hotkeysDescription.wave.saw.start'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.start`}
                        value={params.start}
                        name={`changeFunctions.${name}.start`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        hkLabel={'cf.hotkeysDescription.wave.saw.end'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.end`}
                        value={params.end}
                        name={`changeFunctions.${name}.end`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
                        hkLabel={'cf.hotkeysDescription.wave.saw.t'}
                        hkData1={functionParams.number}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.t`}
                        value={params.t}
                        name={`changeFunctions.${name}.t`}
                        range={tRange}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}
