import {createStore, combineReducers, applyMiddleware} from "redux";
import {MainCanvasState, mainCanvasReducer} from "./mainCanvas/reducer";
import logger from 'redux-logger';
import thunk from 'redux-thunk';

export interface AppState {
    mainCanvas: MainCanvasState
}

const rootReducer = combineReducers<AppState>({
    mainCanvas: mainCanvasReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));