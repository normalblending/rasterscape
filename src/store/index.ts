import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import {PatternsState, patternsReducer} from "./patterns/reducer";
import {ToolState, toolReducer} from "./tool/reducer";
import {BrushState, brushReducer} from "./brush/reducer";
import {LineState, lineReducer} from "./line/reducer";
import {SelectToolState, selectToolReducer} from "./selectTool/reducer";
import {RoomsState, roomsReducer} from "./rooms/reducer";
import {ChangeFunctionsState, changeFunctionsReducer, changingReducer} from "./changeFunctions/reducer";
import {colorReducer, ColorState} from "./color/reducer";

export interface AppState {
    patterns: PatternsState
    brush: BrushState
    tool: ToolState
    line: LineState
    selectTool: SelectToolState
    rooms: RoomsState
    changeFunctions: ChangeFunctionsState
    changing: boolean
    color: ColorState
}

const rootReducer = combineReducers<AppState>({
    patterns: patternsReducer,
    brush: brushReducer,
    tool: toolReducer,
    line: lineReducer,
    selectTool: selectToolReducer,
    rooms: roomsReducer,
    changeFunctions: changeFunctionsReducer,
    changing: changingReducer,
    color: colorReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));