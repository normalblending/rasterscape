import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import "../../styles/sinChangeFunction.scss";

export interface SinCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface SinCFState {

}

export class SinCF extends React.PureComponent<SinCFProps, SinCFState> {

    handleAChange = ({value}) => {
        this.props.onChange({...this.props.params, a: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"sin-change-function"}>
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.a`}
                    value={params.a}
                    range={[0, 1]}
                    onChange={this.handleAChange}
                />
                <Params
                    name={name}
                    data={paramsConfig}
                    value={params}
                    onChange={onChange}
                />
            </div>
        );
    }
}