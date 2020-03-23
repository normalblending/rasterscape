import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store/index";
import {Color} from "../_shared/Color";
import {changeColor} from "../../store/color/actions";

export interface ColorStateProps {
    color: string
}

export interface ColorActionProps {
    changeColor
}

export interface ColorOwnProps {

}

export interface ColorProps extends ColorStateProps, ColorActionProps, ColorOwnProps {

}

export interface ColorState {

}

class ColorComponent extends React.PureComponent<ColorProps, ColorState> {
    render() {
        const {color, changeColor} = this.props;
        return (
            <Color color={color} onChange={changeColor} />
        );
    }
}

const mapStateToProps: MapStateToProps<ColorStateProps, ColorOwnProps, AppState> = state => ({
    color: state.color.value
});

const mapDispatchToProps: MapDispatchToProps<ColorActionProps, ColorOwnProps> = {
    changeColor
};

export const ColorPalette = connect<ColorStateProps, ColorActionProps, ColorOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ColorComponent);