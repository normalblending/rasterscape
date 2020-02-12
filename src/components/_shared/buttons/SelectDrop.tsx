import * as React from "react";
import {defaultGetText, SelectButtons, SelectButtonsProps} from "./SelectButtons";
import * as classNames from "classnames";
import "../../../styles/selectDrop.scss"
import {Button} from "./Button";

export interface SelectDropProps extends SelectButtonsProps {

}

export interface SelectDropState {

}

export class SelectDrop extends React.PureComponent<SelectDropProps, SelectDropState> {

    render() {
        const {className, ...props} = this.props;
        const {value, getText = defaultGetText} = props;
        console.log("select drop render", props.name, value);

        return (
            <div className={classNames(className, "select-drop")}>
                <Button className={"select-drop-value"}>
                    {value || "null"}
                </Button>
                <SelectButtons {...props} className={"select-drop-items"}/>
            </div>
        );
    }
}