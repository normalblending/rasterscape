import * as React from "react";
import {ButtonSelect} from "./ButtonSelect";
import {ButtonNumber} from "./ButtonNumber";

export interface Param {
    type: EParamType
    props?: object
    name: string
}

export enum EParamType {
    Boolean = "boolean",
    Number = "number",
    Select = "select",
}

export const ParamComponents = {
    [EParamType.Boolean]: ButtonSelect,
    [EParamType.Number]: ButtonNumber,
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

    handleChange = (changedValue, changedName) => {
        const {value, onChange, name} = this.props;
        onChange && onChange({...value, [changedName]: changedValue}, name);
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