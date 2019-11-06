import * as React from "react";
import {ButtonBoolean} from "./ButtonBoolean";
import {ButtonNumber} from "./ButtonNumber";

export enum ESelectItemType {
    Bool = "boolean",
    Number = "number"
}

export interface SelectCompactItem {
    value: any
    text: string
    type: ESelectItemType
    props?: object
}

export interface SelectCompactProps {
    items: SelectCompactItem[]
    value: any
    name?: string

    onChange(value: any, subValue: any, name: string)
}

export const ItemComponents = {
    [ESelectItemType.Bool]: ButtonBoolean,
    [ESelectItemType.Number]: ButtonNumber,
};

export interface SelectCompactState {

}

export class SelectCompact extends React.PureComponent<SelectCompactProps, SelectCompactState> {

    handleSelect = (subValue, value) => {
        const {onChange, name: selectName} = this.props;

        onChange && onChange(value, subValue, selectName);
    };

    render() {
        const {items, value} = this.props;
        return (
            <div>
                {items.map(item => {
                    const {type, value: itemValue, text, props} = item;
                    const ItemComponent = ItemComponents[type];
                    return (
                        <ItemComponent
                            key={itemValue}
                            name={itemValue}
                            selected={itemValue === value}
                            text={text}
                            onClick={this.handleSelect}
                            {...props}/>
                    )
                })}
            </div>
        );
    }
}