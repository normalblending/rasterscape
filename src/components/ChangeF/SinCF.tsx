import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import "../../styles/sinChangeFunction.scss";
import {ValueD} from "../_shared/ButtonNumber";

export interface SinCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface SinCFState {

}

export class SinCF extends React.PureComponent<SinCFProps, SinCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"sin-change-function"}>
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.a`}
                    value={params.a}
                    name={"a"}
                    range={[0, 1]}
                    valueD={ValueD.VerticalLinear(100)}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.t`}
                    value={params.t}
                    name={"t"}
                    range={[0, 1000]}
                    valueD={ValueD.VerticalLinear(0.05)}
                    onChange={this.handleParamChange}
                />
                {/*<ButtonNumberCF*/}
                    {/*path={`changeFunctions.${name}.params.p`}*/}
                    {/*value={params.p}*/}
                    {/*name={"p"}*/}
                    {/*range={[0, 1]}*/}
                    {/*onChange={this.handleParamChange}*/}
                {/*/>*/}
            </div>
        );
    }
}