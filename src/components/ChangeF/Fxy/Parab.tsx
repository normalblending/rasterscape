import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/ButtonNumberCF";
import "../../../styles/XYParaboloidChangeFunction.scss";
import {ValueD} from "../../_shared/buttons/ButtonNumber";
import {HelpTooltip} from "../../tutorial/HelpTooltip";
import {FxyType} from "../../../store/changeFunctions/functions/fxy";
import {Paraboloid} from "../../_shared/canvases/WebWorkerCanvas";

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
        return tutorial ? ({button}) => (
            <HelpTooltip
                secondaryMessage={message !== 'kz' && <span>z = kx⋅x² + ky⋅y² + dz</span>}
                message={message}>{button}</HelpTooltip>) : null
    };

    buttonWrapperDZ = this.buttonWrapper('dz');
    buttonWrapperKX = this.buttonWrapper('kx');
    buttonWrapperKY = this.buttonWrapper('ky');
    buttonWrapperKZ = this.buttonWrapper('kz');

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
                        buttonWrapper={this.buttonWrapperDZ}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.zd`}
                        value={params.zd}
                        name={"zd"}
                        range={[-2, 2]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        buttonWrapper={this.buttonWrapperKX}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.x`}
                        value={params.x}
                        name={"x"}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={25}
                        buttonWrapper={this.buttonWrapperKY}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.y`}
                        value={params.y}
                        name={"y"}
                        range={[-20, 20]}
                        onChange={this.handleParamChange}
                    />
                    <ButtonNumberCF
                        pres={2}
                        valueD={50}
                        buttonWrapper={this.buttonWrapperKZ}
                        path={`changeFunctions.functions.${name}.params.typeParams.${FxyType.Parab}.end`}
                        value={params.end}
                        name={"end"}
                        range={seRange}
                        onChange={this.handleParamChange}
                    />
                </div>
            </div>
        );
    }
}