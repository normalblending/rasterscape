import {ThunkAction} from "redux-thunk";
import {Action} from "redux";

export type ThunkResult<R, TAppState> = ThunkAction<R, TAppState, undefined, Action>;