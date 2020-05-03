import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";

export interface SinStateProps {
    used: boolean
}

export interface SinActionProps {
}

export interface SinOwnProps {
    name

}

export interface SinProps extends SinStateProps, SinActionProps, SinOwnProps {

}

const SinComponent: React.FC<SinProps> = ({used}) => {

    return (
        <div className={'help-tooltip-container'}>
            <div className={'sin-help-message'}>
                <span className={'small-text-help'}>
                {used
                    ? ''
                    : 'select this function in menu of any slider'}
                </span>
            </div>
        </div>
    );
};

const mapStateToProps: MapStateToProps<SinStateProps, SinOwnProps, AppState> = (state, {name}) => ({
    used: Object.values(state.changingValues).some(({changeFunctionId}) => changeFunctionId === name)
});

const mapDispatchToProps: MapDispatchToProps<SinActionProps, SinOwnProps> = {};

export const SinHelp = connect<SinStateProps, SinActionProps, SinOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(SinComponent);