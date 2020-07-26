import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {withTranslation, WithTranslation} from 'react-i18next';
import {AppState} from "../../store";
import {EToolType} from "../../store/tool/types";
import {setCurrentTool} from "../../store/tool/actions";
import {Brush} from "./Brush";
import {Line} from "./Line";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {SelectTool} from "./SelectTool";
import {reverseFullScreen} from "../../store/fullscreen";
import * as classNames from "classnames";
import "../../styles/tools.scss";
import {HelpTooltip} from "../tutorial/HelpTooltip";

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

export interface ToolsProps extends ToolsStateProps, ToolsActionProps, ToolsOwnProps, WithTranslation {

}

const ToolsComponent: React.FC<ToolsProps> = ({t, i18n, currentTool, setCurrentTool, reverseFullScreen, className}) => {

    const ToolControls = ToolsParams[currentTool].component;
    return (
        <div className={classNames("tools", className)}>
            <div>
                <HelpTooltip message={t('tools.tools')}>
                    {Object.keys(ToolsParams).map(toolType => (
                        <ButtonSelect
                            key={toolType}
                            selected={toolType === currentTool}
                            onClick={() => setCurrentTool(ToolsParams[toolType].type)}>
                            {t(`tools.${toolType.toLowerCase()}`)}
                        </ButtonSelect>
                    ))}
                </HelpTooltip>
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
)(withTranslation('common')(ToolsComponent));