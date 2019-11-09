import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";

export interface LineStateProps {
}

export interface LineActionProps {
}

export interface LineOwnProps {

}

export interface LineProps extends LineStateProps, LineActionProps, LineOwnProps {

}

const LineComponent: React.FC<LineProps> = ({}) => {

    return (
        <>

        </>
    );
};

const mapStateToProps: MapStateToProps<LineStateProps, LineOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<LineActionProps, LineOwnProps> = {};

export const Line = connect<LineStateProps, LineActionProps, LineOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(LineComponent);