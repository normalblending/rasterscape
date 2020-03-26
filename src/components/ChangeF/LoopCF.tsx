import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import "../../styles/sinChangeFunction.scss";
import {ValueD} from "../_shared/buttons/ButtonNumber";

export interface LoopCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface LoopCFState {

}


const tRange = [-3000, 3000] as [number, number];
const tValueD = ValueD.VerticalLinear(.05);
const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

export class LoopCF extends React.PureComponent<LoopCFProps, LoopCFState> {

    shouldComponentUpdate(nextProps: Readonly<LoopCFProps>, nextState: Readonly<LoopCFState>, nextContext: any): boolean {
        return nextProps.params !== this.props.params
    }

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"sin-change-function"}>
                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.start`}
                    value={params.start}
                    name={"start"}
                    valueD={seValueD}
                    range={seRange}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.end`}
                    value={params.end}
                    name={"end"}
                    valueD={seValueD}
                    range={seRange}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.t`}
                    value={params.t}
                    name={"t"}
                    valueD={tValueD}
                    range={tRange}
                    onChange={this.handleParamChange}
                />
            </div>
        );
    }
}