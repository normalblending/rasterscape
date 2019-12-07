import * as React from "react";
import "../styles/layout.scss";
import {Patterns} from "./Patterns";
import {Tools} from "./Tools";
import {Rooms} from "./Rooms";
import {ChangeF} from "./ChangeF";
import {connect} from "react-redux";
import {setFullScreen} from "../store/fullscreen";
import {AppState} from "../store";
import FullScreen from "react-full-screen";

export interface LayoutStateProps {
    full: boolean
}

export interface LayoutActionProps {
    setFullScreen(value: boolean)
}

export interface LayoutProps extends LayoutStateProps, LayoutActionProps {
}

export const LayoutComponent: React.FC<LayoutProps> = ({full, setFullScreen}) => {

    return (
        <FullScreen enabled={full} onChange={setFullScreen}>
            <div className={"layout-container"}>
                <div className="layout">
                    <div className="tools-panel">
                        <Tools/>
                    </div>
                    <div className="windows">
                        <Patterns/>
                        <Rooms/>
                        <ChangeF/>
                    </div>
                </div>
            </div>
        </FullScreen>
    );
};

export const Layout = connect<LayoutStateProps, LayoutActionProps, {}, AppState>(state => ({
    full: state.fullScreen
}), {
    setFullScreen
})(LayoutComponent);