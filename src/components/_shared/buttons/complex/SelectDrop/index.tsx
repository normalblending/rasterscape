import * as React from "react";
import {defaultGetText, defaultGetValue, SelectButtons, SelectButtonsProps} from "../SelectButtons";
import * as classNames from "classnames";
import "./styles.scss";
import {Button} from "components/_shared/buttons/simple/Button";

export interface SelectDropProps extends SelectButtonsProps {
    open?: boolean
    onValueMouseEnter?()
    onValueMouseLeave?()
    nullText?: string;
}

export interface SelectDropState {

}

export class SelectDrop extends React.PureComponent<SelectDropProps, SelectDropState> {

    render() {
        const {className, nullText, ...props} = this.props;
        const {
            open,
            value,
            getValue = defaultGetValue,
            getText = defaultGetText,
            items,
            onValueMouseEnter,
            onValueMouseLeave,
        } = props;
        // console.log("select drop render", props.name, value);

        const valueItem = items.find(item => getValue(item) === value);
        return (
            <div className={classNames(className, "select-drop", {
                'select-drop-open': open
            })}>
                <Button
                    onMouseEnter={onValueMouseEnter}
                    onMouseLeave={onValueMouseLeave}
                    className={"select-drop-value"}
                >
                    {valueItem ? getText(valueItem) : (nullText || "null")}
                </Button>
                <SelectButtons
                    {...props}
                    className={"select-drop-items"}
                />
            </div>
        );
    }
}