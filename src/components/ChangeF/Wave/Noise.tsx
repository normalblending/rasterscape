import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/noiseChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
// import {NoiseHelp} from "../../tutorial/tooltips/NoiseHelp";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Noise} from "../../_shared/canvases/WebWorkerCanvas";
// import {Noise} from "../../_shared/canvases/WebWorkerCanvas";

export interface NoiseCFProps {
    tutorial: boolean
    params: any

    name: string

    onChange(value?: any, name?: string)

}

export interface NoiseCFState {

}

const fRange = [0, 5] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 40000] as [number, number];

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

const seRange = [0, 1] as [number, number];

export class NoiseCF extends React.PureComponent<NoiseCFProps, NoiseCFState> {

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

    buttonWrapperMin = this.buttonWrapper('min');
    buttonWrapperMax = this.buttonWrapper('max');
    buttonWrapperFreq = this.buttonWrapper('freq');


    render() {
        const {params, name, tutorial} = this.props;
        return (
            // <HelpTooltip component={NoiseHelp} getY={() => 27} offsetX={40}>
            <div className={"noise-change-function"}>
                {/*<HelpTooltip component={NoiseHelp} componentProps={{name}}>*/}
                    <Noise
                        width={68}
                        height={58}
                        params={params}/>
                {/*</HelpTooltip>*/}
                <div className={'noise-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        buttonWrapper={this.buttonWrapperMin}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.start`}
                        value={params.start}
                        name={"start"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={100}
                        buttonWrapper={this.buttonWrapperMax}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.end`}
                        value={params.end}
                        name={"end"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        buttonWrapper={this.buttonWrapperFreq}
                        pres={3}
                        valueD={1000}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Noise}.f`}
                        value={params.f}
                        name={"f"}
                        range={fRange}
                        onChange={this.handleParamChange}
                    />

                </div>
            </div>
            // </HelpTooltip>
        );
    }
}