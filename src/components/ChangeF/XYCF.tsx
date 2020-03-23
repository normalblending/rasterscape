import * as React from "react";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import "../../styles/XYParaboloidChangeFunction.scss";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {Surface2d} from "../_shared/canvases/Surface2d";
import {ECFType} from "../../store/changeFunctions/types";

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
            <div className={"XY_PARABOLOID-change-function"}>
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.zd`}
                    value={params.zd}
                    name={"zd"}
                    range={[-2, 2]}
                    valueD={ValueD.VerticalLinear(20)}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.x`}
                    value={params.x}
                    name={"x"}
                    range={[-20, 20]}
                    precision={200}
                    valueD={ValueD.VerticalLinear(2)}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.y`}
                    value={params.y}
                    name={"y"}
                    range={[-20, 20]}
                    precision={200}
                    valueD={ValueD.VerticalLinear(2)}
                    onChange={this.handleParamChange}
                />
                <Surface2d
                    type={ECFType.XY_PARABOLOID}
                    params={params}
                    width={70} height={70}/>
                <ButtonNumberCF
                    path={`changeFunctions.${name}.params.end`}
                    value={params.end}
                    name={"end"}
                    valueD={seValueD}
                    range={seRange}
                    onChange={this.handleParamChange}
                />
            </div>
        );
    }
}