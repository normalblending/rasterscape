import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import "../../styles/XYChangeFunction.scss";
import {ValueD} from "../_shared/ButtonNumber";

export interface XYCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface XYCFState {

}

const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

export class XYCF extends React.PureComponent<XYCFProps, XYCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"XY-change-function"}>
                xy

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
                    path={`changeFunctions.${name}.params.x`}
                    value={params.x}
                    name={"x"}
                    range={[-500, 1000]}
                    valueD={ValueD.VerticalLinear(0.05)}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.y`}
                    value={params.y}
                    name={"y"}
                    range={[-500, 1000]}
                    valueD={ValueD.VerticalLinear(0.05)}
                    onChange={this.handleParamChange}
                />

                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.xa`}
                    value={params.xa}
                    name={"xa"}
                    range={[-10, 10]}
                    valueD={ValueD.VerticalLinear(10)}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.ya`}
                    value={params.ya}
                    name={"ya"}
                    range={[-10, 10]}
                    valueD={ValueD.VerticalLinear(10)}
                    onChange={this.handleParamChange}
                />
            </div>
        );
    }
}