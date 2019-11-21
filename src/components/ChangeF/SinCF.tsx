import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";

export interface SinCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface SinCFState {

}

export class SinCF extends React.PureComponent<SinCFProps, SinCFState> {

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <Params
                name={name}
                data={paramsConfig}
                value={params}
                onChange={onChange}
            />
        );
    }
}