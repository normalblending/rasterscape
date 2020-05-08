import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/sinChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {SinHelp} from "../../tutorial/tooltips/SinHelp";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Sin} from "../../_shared/canvases/WebWorkerCanvas";

export interface SinCFProps {
    tutorial: boolean
    params: any

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
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
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

    buttonWrapperAmplitude = this.buttonWrapper('amplitude');
    buttonWrapperPeriod = this.buttonWrapper('period');
    buttonWrapperPhaseShift = this.buttonWrapper('phase shift');

    render() {
        const {params, name, tutorial} = this.props;
        return (
            // <HelpTooltip component={SinHelp} getY={() => 27} offsetX={40}>
            <div className={"sin-change-function"}>
                <HelpTooltip component={SinHelp} componentProps={{name}}>
                    <Sin
                        width={68}
                        height={58}
                        params={params}
                        Tmax={5000}
                        Amax={1.1}/>
                </HelpTooltip>
                <div className={'sin-controls'}>
                    <ButtonNumberCF
                        buttonWrapper={this.buttonWrapperAmplitude}
                        pres={3}
                        precisionGain={10}
                        valueD={1000}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.a`}
                        value={params.a}
                        name={"a"}
                        range={aRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        buttonWrapper={this.buttonWrapperPeriod}
                        pres={0}
                        precisionGain={10}
                        valueD={2 / 128}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.t`}
                        value={params.t}
                        name={"t"}
                        range={tRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        buttonWrapper={this.buttonWrapperPhaseShift}
                        pres={2}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Sin}.o`}
                        value={params.o}
                        name={"o"}
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
            // </HelpTooltip>
        );
    }
}