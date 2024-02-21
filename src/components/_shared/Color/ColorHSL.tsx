import * as React from "react";

export interface ColorHSLProps {
    colorRGB: string
    onChangeRGB(colorRGB: string)
}

export interface ColorHSLState {

}

export class ColorHSL extends React.PureComponent<ColorHSLProps, ColorHSLState> {

    render() {
        return (
            <div>
            </div>
        );
    }
}