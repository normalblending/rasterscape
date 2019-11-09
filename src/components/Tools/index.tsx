import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {EToolType} from "../../store/tool/types";
import {setCurrentTool} from "../../store/tool/actions";
import {Brush} from "./Brush";
import {Line} from "./Line";
import {Button} from "../_shared/Button";
import {ButtonSelect} from "../_shared/ButtonSelect";

export const ToolsParams = {
    [EToolType.Brush]: {component: Brush, type: EToolType.Brush},
    [EToolType.Line]: {component: Line, type: EToolType.Line},
};

export interface ToolsStateProps {
    currentTool: EToolType
}

export interface ToolsActionProps {
    setCurrentTool(tool: EToolType)
}

export interface ToolsOwnProps {

}

export interface ToolsProps extends ToolsStateProps, ToolsActionProps, ToolsOwnProps {

}

const ToolsComponent: React.FC<ToolsProps> = ({currentTool, setCurrentTool}) => {

    const ToolControls = ToolsParams[currentTool].component;
    return (
        <div className="tools">
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
    setCurrentTool
};

export const Tools = connect<ToolsStateProps, ToolsActionProps, ToolsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(ToolsComponent);