import * as React from "react";

export interface ColorValueProps {
    color: string
}

export interface ColorValueState {

}

export class ColorValue extends React.PureComponent<ColorValueProps, ColorValueState> {

    render() {
        return (
            <div className={'color-value'} style={{backgroundColor: this.props.color}}></div>
        );
    }
}