import {createSelector} from "reselect";
import {AppState} from "../index";
import {DrawToolParams, DrawToolType, EToolType} from "./types";
import {PatternState} from "../patterns/pattern/types";
import {PatternsState} from "../patterns/types";

export const toolTypeSelector =
    createSelector<AppState, EToolType, Record<EToolType.Line | EToolType.Brush, DrawToolType>, DrawToolType>(
        (state: AppState) => state.tool.current,
        (state: AppState) => ({
            [EToolType.Line]: state.line.params.type,
            [EToolType.Brush]: state.brush.params.type
        }),
        (tool, toolTypes) =>
            toolTypes[tool]
    );

export const toolParamsSelector =
    createSelector<AppState, EToolType, Record<EToolType.Line | EToolType.Brush, DrawToolParams>, DrawToolParams>(
        (state: AppState) => state.tool.current,
        (state: AppState) => ({
            [EToolType.Line]: state.line.params,
            [EToolType.Brush]: state.brush.params
        }),
        (tool, toolsParams) =>
            toolsParams[tool]
    );

export const toolPatternSelector =
    createSelector<AppState,DrawToolParams, PatternsState, PatternState>(
        toolParamsSelector,
        (state: AppState) => state.patterns,
        (toolParams, patterns) =>
            toolParams ? patterns[toolParams.pattern] : null
    );
