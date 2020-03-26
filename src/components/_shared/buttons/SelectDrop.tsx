import * as React from "react";
import {defaultGetText, defaultGetValue, SelectButtons, SelectButtonsProps} from "./SelectButtons";
import * as classNames from "classnames";
import "../../../styles/selectDrop.scss"
import {Button} from "./Button";

export interface SelectDropProps extends SelectButtonsProps {
    nullText?: string;
}

export interface SelectDropState {

}

export class SelectDrop extends React.PureComponent<SelectDropProps, SelectDropState> {

    render() {
        const {className, nullText, ...props} = this.props;
        const {value, getValue = defaultGetValue, getText = defaultGetText, items} = props;
        console.log("select drop render", props.name, value);

        const valueItem = items.find(item => getValue(item) === value);
        return (
            <div className={classNames(className, "select-drop")}>
                <Button className={"select-drop-value"}>
                    {valueItem ? getText(valueItem) : (nullText || "null")}
                </Button>
                <SelectButtons {...props} className={"select-drop-items"}/>
            </div>
        );
    }
}