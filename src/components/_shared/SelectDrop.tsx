import * as React from "react";
import {defaultGetText, SelectButtons, SelectButtonsProps} from "./SelectButtons";
import * as classNames from "classnames";

export interface SelectDropProps extends SelectButtonsProps {

}

export interface SelectDropState {

}

export class SelectDrop extends React.PureComponent<SelectDropProps, SelectDropState> {

    render() {
        const {className, ...props} = this.props;
        const {value, getText = defaultGetText} = props;
        console.log(value)
        return (
            <div className={classNames(className, "select-drop")}>
                <div className={"select-drop-value"}>
                    {value && getText(value)}
                </div>

                <div className={"select-drop-items"}>
                    <SelectButtons {...props}/>
                </div>
            </div>
        );
    }
}