import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/sawChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {WaveType} from "../../../store/changeFunctions/functions/wave";
import {Saw} from "../../_shared/canvases/WebWorkerCanvas";

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
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    buttonWrapper = (message) => {
        const {tutorial} = this.props;
        return tutorial ? ({button}) => (
            <HelpTooltip
                // secondaryMessage={message === 'period' &&
                // <span>negative value for movement<br/> in the opposite direction</span>}
                message={message}>{button}</HelpTooltip>) : null
    };

    buttonWrapperMin = this.buttonWrapper('min');
    buttonWrapperMax = this.buttonWrapper('max');
    buttonWrapperPeriod = this.buttonWrapper('period');

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
                        buttonWrapper={this.buttonWrapperMin}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.start`}
                        value={params.start}
                        name={"start"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        // valueD={100}
                        buttonWrapper={this.buttonWrapperMax}
                        path={`changeFunctions.functions.${name}.params.typeParams.${WaveType.Saw}.end`}
                        value={params.end}
                        name={"end"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={0}
                        buttonWrapper={this.buttonWrapperPeriod}
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