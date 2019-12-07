import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import "../../styles/sinChangeFunction.scss";
import {ValueD} from "../_shared/ButtonNumber";

export interface LoopCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface LoopCFState {

}


const tRange = [0, 3000] as [number, number];
const tValueD = ValueD.VerticalLinear(.05);
const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

export class LoopCF extends React.PureComponent<LoopCFProps, LoopCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"sin-change-function"}>
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.start`}
                    value={params.start}
                    name={"start"}
                    valueD={seValueD}
                    range={seRange}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.end`}
                    value={params.end}
                    name={"end"}
                    valueD={seValueD}
                    range={seRange}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.t`}
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