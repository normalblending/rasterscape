import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import "../../../styles/XYParaboloidChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {FxyType} from "../../../store/changeFunctions/functions/fxy";
import {Paraboloid} from "../../_shared/canvases/WebWorkerCanvas";
import {SinHelp} from "../../tutorial/tooltips/SinHelp";

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
        this.props.onChange({...this.props.params, [name.split('.').reverse()[0]]: value}, this.props.name)
    };

    render() {
        const {params, name} = this.props;
        return (
            <div className={"parab-change-function"}>

                <div className={'parab-controls'}>
                    <div className={'canvas-container'}>
                        <Paraboloid
                            params={params}
                            width={68} height={58}/>
                    </div>
                </div>
                <div className={'parab-controls'}>
                    <ButtonNumberCF
                        pres={2}
                        valueD={50}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.zd`}
                        hkLabel={`${name} ${FxyType.Parab} zd`}
                        value={params.zd}
                        name={`changeFunctions.${name}.zd`}
                        range={[-2, 2]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.x`}
                        hkLabel={`${name} ${FxyType.Parab} kx`}
                        value={params.x}
                        name={`changeFunctions.${name}.x`}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.y`}
                        hkLabel={`${name} ${FxyType.Parab} ky`}
                        value={params.y}
                        name={`changeFunctions.${name}.y`}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={50}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.end`}
                        hkLabel={`${name} ${FxyType.Parab} top`}
                        value={params.end}
                        name={`changeFunctions.${name}.end`}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}