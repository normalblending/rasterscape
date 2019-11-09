import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import {MainWindowState, mainWindowReducer} from "./mainWindow/reducer";
import {PatternsState, patternsReducer} from "./patterns/reducer";
import {ToolState, toolReducer} from "./tool/reducer";
import {BrushState, brushReducer} from "./brush/reducer";
import {LineState, lineReducer} from "./line/reducer";

export interface AppState {
    mainWindow: MainWindowState
    patterns: PatternsState
    brush: BrushState
    tool: ToolState
    line: LineState
}

const rootReducer = combineReducers<AppState>({
    mainWindow: mainWindowReducer,
    patterns: patternsReducer,
    brush: brushReducer,
    tool: toolReducer,
    line: lineReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));