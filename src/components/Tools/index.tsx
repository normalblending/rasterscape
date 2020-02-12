import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {EToolType} from "../../store/tool/types";
import {setCurrentTool} from "../../store/tool/actions";
import {Brush} from "./Brush";
import {Line} from "./Line";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {SelectTool} from "./SelectTool";
import {Button} from "../_shared/buttons/Button";
import {reverseFullScreen} from "../../store/fullscreen";
import * as classNames from "classnames";
import "../../styles/tools.scss";

export const ToolsParams = {
    [EToolType.Brush]: {component: Brush, type: EToolType.Brush},
    [EToolType.Line]: {component: Line, type: EToolType.Line},
    [EToolType.Select]: {component: SelectTool, type: EToolType.Select},
};

export interface ToolsStateProps {
    currentTool: EToolType
}

export interface ToolsActionProps {
    setCurrentTool(tool: EToolType)
    reverseFullScreen()
}

export interface ToolsOwnProps {
    className?: string
}

export interface ToolsProps extends ToolsStateProps, ToolsActionProps, ToolsOwnProps {

}

const ToolsComponent: React.FC<ToolsProps> = ({currentTool, setCurrentTool, reverseFullScreen, className}) => {

    const ToolControls = ToolsParams[currentTool].component;
    return (
        <div className={classNames("tools", className)}>
            <div>
                {Object.keys(ToolsParams).map(toolType => (
                    <ButtonSelect
                        key={toolType}
                        selected={toolType === currentTool}
                        onClick={() => setCurrentTool(ToolsParams[toolType].type)}>
                        {toolType}</ButtonSelect>
                ))}
            </div>
            <ToolControls/>
        </div>
    );
};

const mapStateToProps: MapStateToProps<ToolsStateProps, ToolsOwnProps, AppState> = state => ({
    currentTool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<ToolsActionProps, ToolsOwnProps> = {
    setCurrentTool, reverseFullScreen
};

export const Tools = connect<ToolsStateProps, ToolsActionProps, ToolsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ToolsComponent);