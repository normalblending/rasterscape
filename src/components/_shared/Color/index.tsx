import * as React from "react";
import '../../../styles/color.scss';
import {ColorValue} from "./ColorValue";

export interface ColorProps {
    color: string
    onChange(color: string)
}

export interface ColorState {

}

export class Color extends React.PureComponent<ColorProps, ColorState> {

    render() {
        const {color} = this.props;
        return (
            <div className={'color'}>
                <ColorValue color={color}/>
            </div>
        );
    }
}