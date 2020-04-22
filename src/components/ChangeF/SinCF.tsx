import * as React from "react";
import {ParamConfig, Params} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import "../../styles/sinChangeFunction.scss";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {Wave} from "../_shared/canvases/Wave";

export interface SinCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)

}

export interface SinCFState {

}

const aRange = [0, 1] as [number, number];
const aVD = ValueD.VerticalLinear(100);

const tRange = [0, 5000] as [number, number];
const tVD = ValueD.VerticalLinear(0.03);

const oRange = [0, 1] as [number, number];
const oVD = ValueD.VerticalLinear(100);

const valueText2 = value => value.toFixed(2);

export class SinCF extends React.PureComponent<SinCFProps, SinCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    render() {
        const {params, paramsConfig, onChange, name} = this.props;
        return (
            <div className={"sin-change-function"}>
                <ButtonNumberCF
                    precision={100}
                    path={`changeFunctions.functions.${name}.params.a`}
                    value={params.a}
                    name={"a"}
                    range={aRange}
                    getText={valueText2}
                    valueD={aVD}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    precision={500}
                    path={`changeFunctions.functions.${name}.params.t`}
                    value={params.t}
                    name={"t"}
                    range={tRange}
                    valueD={tVD}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    precision={100}
                    path={`changeFunctions.functions.${name}.params.o`}
                    value={params.o}
                    name={"o"}
                    getText={valueText2}
                    range={oRange}
                    valueD={oVD}
                    onChange={this.handleParamChange}
                />
                <Wave
                    W={68}
                    H={50}
                    O={params.o}
                    Tmax={5000}
                    Amax={1}
                    A={params.a}
                    T={params.t}/>
                {/*<ButtonNumberCF*/}
                {/*path={`changeFunctions.functions.${name}.params.p`}*/}
                {/*value={params.p}*/}
                {/*name={"p"}*/}
                {/*range={[0, 1]}*/}
                {/*onChange={this.handleParamChange}*/}
                {/*/>*/}
            </div>
        );
    }
}