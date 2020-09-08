import * as React from "react";
import {ButtonSelect} from "./buttons/simple/ButtonSelect";
import {ButtonNumber} from "./buttons/complex/ButtonNumber";
import {SelectButtons} from "./buttons/complex/SelectButtons";
import {EventData} from "../../utils/types";
import {File} from "./File";

export interface ParamConfig {
    type: EParamType
    props?: any
    name: string
}

export enum EParamType {
    Boolean = "boolean",
    Number = "number",
    Select = "select",
    ImageData = "imageData",
}

export const ParamComponents = {
    [EParamType.Boolean]: ButtonSelect,
    [EParamType.Select]: SelectButtons,
    [EParamType.Number]: ButtonNumber,
    [EParamType.ImageData]: File,
};

export interface ParamsProps {
    data: any
    value?: any
    name?: string

    onChange?(value?: any, name?: string)
}

export interface ParamsState {

}

export class Params extends React.PureComponent<ParamsProps, ParamsState> {

    handleChange = (data: EventData) => {
        const {value, onChange, name} = this.props;

        console.log(data);
        onChange && onChange({...value, [data.name]: data.value}, name);
    };

    render() {
        const {data, value} = this.props;
        return (
            <div className={"params"}>
                {data.map(paramConfig => {
                    const {type, name, props} = paramConfig;
                    const Component = ParamComponents[type] || ButtonSelect;
                    return (
                        <Component
                            {...props}
                            value={value[name]}
                            name={name}
                            onChange={this.handleChange}
                            key={name}/>
                    );
                })}
            </div>
        );
    }
}