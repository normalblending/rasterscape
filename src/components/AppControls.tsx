import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/buttons/Button";
import {reverseFullScreen} from "../store/fullscreen";
import * as classNames from "classnames";

export interface AppControlsStateProps {
    isFull: boolean
}

export interface AppControlsActionProps {
    reverseFullScreen()
}

export interface AppControlsOwnProps {

}

export interface AppControlsProps extends AppControlsStateProps, AppControlsActionProps, AppControlsOwnProps {

}

export interface AppControlsState {

}

class AppControlsComponent extends React.PureComponent<AppControlsProps, AppControlsState> {
    render() {
        const {reverseFullScreen, isFull} = this.props;
        return (
            <div className='app-controls'>
                <Button
                    className="app-control-button"
                    onClick={reverseFullScreen}>lang</Button>
                <Button
                    className="app-control-button"
                    onClick={reverseFullScreen}>?</Button>
                <Button
                    className={classNames("app-control-button", "full-button", {
                        ["full-button-off"]: isFull
                    })}
                    onClick={reverseFullScreen}>
                    <div className="tl"></div>
                    <div className="br"></div>
                </Button>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<AppControlsStateProps, AppControlsOwnProps, AppState> = state => ({
    isFull: state.fullScreen
});

const mapDispatchToProps: MapDispatchToProps<AppControlsActionProps, AppControlsOwnProps> = {
    reverseFullScreen
};

export const AppControls = connect<AppControlsStateProps, AppControlsActionProps, AppControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(AppControlsComponent);