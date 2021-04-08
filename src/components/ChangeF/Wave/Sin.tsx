import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "../../../styles/sinChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {SinHelp} from "../../tutorial/tooltips/SinHelp";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Sin} from "../../_shared/canvases/WebWorkerCanvas";
import {ChangeFunctionState} from "../../../store/changeFunctions/types";

export interface SinCFProps {
    tutorial: boolean
    params: any
    functionParams: ChangeFunctionState

    name: string

    onChange(value?: any, name?: string)

}

export interface SinCFState {

}

const aRange = [0, 1] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 40000] as [number, number];

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

export class SinCF extends React.PureComponent<SinCFProps, SinCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name.split('.').reverse()[0]]: value}, this.props.name)
    };

    render() {
        const {params, name, functionParams} = this.props;
        return (
            <div className={"sin-change-function"}>
                <Sin
                    width={68}
                    height={58}
                    params={params}
                    Tmax={5000}
                    Amax={1.1}/>
                <div className={'sin-controls'}>
                    <ButtonNumberCF
                        pres={3}
                        precisionGain={10}
                        valueD={1000}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.a`}
                        hkLabel={'cf.hotkeysDescription.wave.sin.a'}
                        hkData1={functionParams.number}
                        value={params.a}
                        name={`changeFunctions.${name}.a`}
                        range={aRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
                        precisionGain={10}
                        valueD={2 / 128}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.t`}
                        hkLabel={'cf.hotkeysDescription.wave.sin.t'}
                        hkData1={functionParams.number}
                        value={params.t}
                        name={`changeFunctions.${name}.t`}
                        range={tRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.o`}
                        hkLabel={'cf.hotkeysDescription.wave.sin.o'}
                        hkData1={functionParams.number}
                        value={params.o}
                        name={`changeFunctions.${name}.o`}
                        getText={valueText2}
                        range={oRange}
                        valueD={100}
                        onChange={this.handleParamChange}
                    />
                </div>
                {/*<ButtonNumberCF*/}
                {/*path={`changeFunctions.functions.${name}.params.p`}*/}
                {/*value={params.p}*/}
                {/*name={"p"}*/}
                {/*range={[0, 1]}*/}
                {/*onChange={this.handleParamChange}*/}
                {/*/>*/}
            </div>
        );
    }
}