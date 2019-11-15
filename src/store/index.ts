import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import {PatternsState, patternsReducer} from "./patterns/reducer";
import {ToolState, toolReducer} from "./tool/reducer";
import {BrushState, brushReducer} from "./brush/reducer";
import {LineState, lineReducer} from "./line/reducer";
import {SelectToolState, selectToolReducer} from "./selectTool/reducer";

export interface AppState {
    patterns: PatternsState
    brush: BrushState
    tool: ToolState
    line: LineState
    selectTool: SelectToolState
}

const rootReducer = combineReducers<AppState>({
    patterns: patternsReducer,
    brush: brushReducer,
    tool: toolReducer,
    line: lineReducer,
    selectTool: selectToolReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));