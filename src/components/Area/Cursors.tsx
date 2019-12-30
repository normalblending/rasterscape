import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";

export interface CursorsStateProps {
}

export interface CursorsActionProps {
}

export interface CursorsOwnProps {

}

export interface CursorsProps extends CursorsStateProps, CursorsActionProps, CursorsOwnProps {

}

export interface CursorsState {

}

class CursorsComponent extends React.PureComponent<CursorsProps, CursorsState> {
    render() {
        return (
            <>

            </>
        );
    }
}

const mapStateToProps: MapStateToProps<CursorsStateProps, CursorsOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<CursorsActionProps, CursorsOwnProps> = {};

export const Cursors = connect<CursorsStateProps, CursorsActionProps, CursorsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(CursorsComponent);