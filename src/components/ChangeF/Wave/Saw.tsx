import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "../../../styles/sawChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Saw} from "../../_shared/canvases/WebWorkerCanvas";
import {SinHelp} from "../../tutorial/tooltips/SinHelp";

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

    // shouldComponentUpdate(nextProps: Readonly<SawCFProps>, nextState: Readonly<SawCFState>, nextContext: any): boolean {
    //     return nextProps.params !== this.props.params
    // }

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name.split('.').reverse()[0]]: value}, this.props.name)
    };

    render() {
        const {params, onChange, name} = this.props;
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
                        // valueD={100}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.start`}
                        value={params.start}
                        name={`changeFunctions.${name}.start`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        // valueD={100}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.end`}
                        value={params.end}
                        name={`changeFunctions.${name}.end`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
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