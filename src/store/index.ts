import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reduceReducers from 'reduce-reducers';

import {patternsReducer} from "./patterns/reducer";
import {ToolState, toolReducer} from "./tool/reducer";
import {BrushState, brushReducer} from "./brush/reducer";
import {LineState, lineReducer} from "./line/reducer";
import {SelectToolState, selectToolReducer} from "./selectTool/reducer";
import {RoomsState, roomsReducer} from "./rooms/reducer";
import {ChangeFunctionsState, changeFunctionsReducer} from "./changeFunctions/reducer";
import {ChangingValuesState, changingValuesReducer} from "./changingValues/reducer";
import {changingReducer, ChangingState} from "./changing/reducer";
import {colorReducer, ColorState} from "./color/reducer";
import {changeReducer} from "./change/reducer";
import {fullscreenReducer, FullScreenState} from "./fullscreen";
import {PatternsState} from "./patterns/types";

export interface AppState {
    fullScreen: FullScreenState

    patterns: PatternsState

    color: ColorState

    tool: ToolState
    brush: BrushState
    line: LineState

    selectTool: SelectToolState

    rooms: RoomsState

    changeFunctions: ChangeFunctionsState
    changingValues: ChangingValuesState
    changing: ChangingState
}

const rootReducer = reduceReducers(
    combineReducers<AppState>({
        fullScreen: fullscreenReducer,

        patterns: patternsReducer,

        color: colorReducer,

        tool: toolReducer,
        brush: brushReducer,
        line: lineReducer,

        selectTool: selectToolReducer,

        rooms: roomsReducer,

        changeFunctions: changeFunctionsReducer,
        changingValues: changingValuesReducer,
        changing: changingReducer
    }),
    changeReducer
);

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));
// export const store = createStore(rootReducer, applyMiddleware(thunk));