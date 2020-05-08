import * as React from "react";
import * as classNames from "classnames";
import "../../styles/hover-hideable.scss";
import {whyDidYouRender} from "../../utils/props";

export interface HoverHideableProps {
    children?: React.ReactNode
    button?: React.ReactNode
    className?: string

}

export interface HoverHideableState {

}

export class HoverHideable extends React.PureComponent<HoverHideableProps, HoverHideableState> {

    render() {
        const {children, button, className} = this.props;
        return (
            <div className={classNames("hover-hideable", className)}>
                {button}
                <div className={"hover-hideable-hidden-part"}>{children}</div>
            </div>
        );
    }
}