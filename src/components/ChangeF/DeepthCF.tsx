import * as React from "react";
import {ParamConfig} from "../_shared/Params";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import "../../styles/depthChangeFunction.scss";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {File} from "../_shared/File";
import {imageToImageData} from "../../utils/canvas/helpers/imageData";
import {Canvas} from "../_shared/Canvas";
import {CycledToggle} from "../_shared/buttons/CycledToggle";

export interface DepthCFProps {
    params: any
    paramsConfig: ParamConfig[]

    name: string

    onChange(value?: any, name?: string)
}

export interface DepthCFState {

}

const seRange = [0, 1] as [number, number];
const seValueD = ValueD.VerticalLinear(100);

const componentsSelectItems = [
    {text: 'red', value: 0},
    {text: 'green', value: 2},
    {text: 'blue', value: 3},
    {text: 'alpha', value: 4},
];

export class DepthCF extends React.PureComponent<DepthCFProps, DepthCFState> {

    handleParamChange = (data) => {
        const {value, name} = data;
        this.props.onChange({...this.props.params, [name]: value}, this.props.name)
    };

    handleImage = (image) => {
        const imageData = imageToImageData(image);
        this.props.onChange({
            ...this.props.params,
            imageData,
        }, this.props.name)
    };

    render() {
        const {params, name} = this.props;

        return (
            <div className={"depth-change-function"}>
                <File
                    name={'imageData'}
                    onChange={this.handleImage}
                >open...</File>
                <CycledToggle
                    name={'component'}
                    value={params.component}
                    items={componentsSelectItems}
                    onChange={this.handleParamChange}
                />
                {params['imageData'] &&
                <Canvas
                    width={68}
                    height={68}
                    value={params['imageData']}/>}

                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.zd`}
                    value={params.zd}
                    name={"zd"}
                    range={seRange}
                    valueD={seValueD}
                    onChange={this.handleParamChange}
                />
                <ButtonNumberCF
                    path={`changeFunctions.functions.${name}.params.zed`}
                    value={params.zed}
                    name={"zed"}
                    range={seRange}
                    valueD={seValueD}
                    onChange={this.handleParamChange}
                />
            </div>
        );
    }
}