import * as React from "react";

export interface ColorRGBProps {
    colorRGB: string
    onChangeRGB(colorRGB: string)
}

export interface ColorRGBState {

}

export class ColorRGB extends React.PureComponent<ColorRGBProps, ColorRGBState> {

    render() {
        return (
            <div></div>
        );
    }
}