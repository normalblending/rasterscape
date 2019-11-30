import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store/index";

export interface ColorStateProps {
}

export interface ColorActionProps {
}

export interface ColorOwnProps {

}

export interface ColorProps extends ColorStateProps, ColorActionProps, ColorOwnProps {

}

export interface ColorState {

}

class ColorComponent extends React.PureComponent<ColorProps, ColorState> {
    render() {
        return (
            <>

            </>
        );
    }
}

const mapStateToProps: MapStateToProps<ColorStateProps, ColorOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<ColorActionProps, ColorOwnProps> = {};

export const Color = connect<ColorStateProps, ColorActionProps, ColorOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ColorComponent);