import * as React from "react";
import {ParamConfig} from "../../_shared/Params";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/XYParaboloidChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {Surface2d} from "../../_shared/canvases/Surface2d";
import {ECFType} from "../../../store/changeFunctions/types";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {FxyType} from "../../../store/changeFunctions/functions/fxy";

export interface ParabCFProps {
    tutorial: boolean
    params: any

    name: string

    onChange(value?: any, name?: string)

}

export interface ParabCFState {

}

const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

export class ParabCF extends React.PureComponent<ParabCFProps, ParabCFState> {

    handleParamChange = ({value, name}) => {
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };


    buttonWrapper = (message) => {
        const {tutorial} = this.props;
        return tutorial ? button => (
            <HelpTooltip
                secondaryMessage={message !== 'kz' && <span>z = kx⋅x² + ky⋅y² + dz</span>}
                message={message}>{button}</HelpTooltip>) : null
    };

    render() {
        const {params, name} = this.props;
        return (
            <div className={"parab-change-function"}>

                <div className={'parab-controls'}>
                    <Surface2d
                        type={ECFType.XY_PARABOLOID}
                        params={params}
                        width={68} height={68}/>

                    <ButtonNumberCF
                        pres={2}
                        valueD={50}
                        buttonWrapper={this.buttonWrapper('kz')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.end`}
                        value={params.end}
                        name={"end"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                </div>
                <div className={'parab-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        valueD={50}
                        buttonWrapper={this.buttonWrapper('dz')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.zd`}
                        value={params.zd}
                        name={"zd"}
                        range={[-2, 2]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        buttonWrapper={this.buttonWrapper('kx')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.x`}
                        value={params.x}
                        name={"x"}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        buttonWrapper={this.buttonWrapper('ky')}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.y`}
                        value={params.y}
                        name={"y"}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}