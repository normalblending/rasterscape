import * as React from "react";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import "../../styles/XYParaboloidChangeFunction.scss";
import {ValueD} from "../_shared/ButtonNumber";
import {Surface2d} from "../_shared/canvases/Surface2d";
import {ECFType} from "../../store/changeFunctions/types";
import {SurfaceSection} from "../_shared/canvases/SurfaceSection";

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
                <div className={"XY_PARABOLOID-change-function-row"}>
                    <ButtonNumberCF
                        path={`changeFunctions.${name}.params.zd`}
                        value={params.zd}
                        name={"zd"}
                        range={[-2, 2]}
                        valueD={ValueD.VerticalLinear(20)}
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
                </div>
                <div className={"XY_PARABOLOID-change-function-row"}>
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
                </div>
                {/*<div className={"XY_PARABOLOID-change-function-row"}>*/}

                {/*    <ButtonNumberCF*/}
                {/*        path={`changeFunctions.${name}.params.xa`}*/}
                {/*        value={params.xa}*/}
                {/*        name={"xa"}*/}
                {/*        range={[-200, 200]}*/}
                {/*        valueD={ValueD.VerticalLinear(0.1)}*/}
                {/*        onChange={this.handleParamChange}*/}
                {/*    />*/}
                {/*    <ButtonNumberCF*/}
                {/*        path={`changeFunctions.${name}.params.ya`}*/}
                {/*        value={params.ya}*/}
                {/*        name={"ya"}*/}
                {/*        range={[-200, 200]}*/}
                {/*        valueD={ValueD.VerticalLinear(0.1)}*/}
                {/*        onChange={this.handleParamChange}*/}
                {/*    />*/}
                {/*</div>*/}
                <Surface2d
                    type={ECFType.XY_PARABOLOID}
                    params={params}
                    width={70} height={70}/>
            </div>
        );
    }
}