import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";

export interface MaskDrawStateProps {
}

export interface MaskDrawActionProps {
}

export interface MaskDrawOwnProps {

}

export interface MaskDrawProps extends MaskDrawStateProps, MaskDrawActionProps, MaskDrawOwnProps {

}

export interface MaskDrawState {

}

class MaskDrawComponent extends React.PureComponent<MaskDrawProps, MaskDrawState> {
    render() {
        return (
            <>


            </>
        );
    }
}

const mapStateToProps: MapStateToProps<MaskDrawStateProps, MaskDrawOwnProps, AppState> = state => ({});

const mapDispatchToProps: MapDispatchToProps<MaskDrawActionProps, MaskDrawOwnProps> = {};

export const MaskDraw = connect<MaskDrawStateProps, MaskDrawActionProps, MaskDrawOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(MaskDrawComponent);