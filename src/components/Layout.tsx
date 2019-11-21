import * as React from "react";
import "../styles/layout.scss";
import {Patterns} from "./Patterns";
import {Tools} from "./Tools";
import {Rooms} from "./Rooms";
import {ChangeF} from "./ChangeF";

export interface LayoutProps {

}

export const Layout: React.FC<LayoutProps> = ({}) => {

    return (
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
    );
};