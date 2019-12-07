import {handleActions} from "redux-actions";
import * as immutable from 'object-path-immutable';
import {AppState} from "../index";
import {ChangeToStartValueAction, EChangeAction} from "./actions";
import {changeFunctionByType} from "../changeFunctions/helpers";

export const changeReducer = handleActions<AppState>({
    [EChangeAction.CHANGE]: (state: AppState, action) => {
        console.log(state, action.time);

        const {changeFunctions, changingValues} = state;


        return Object.values(changingValues).reduce((res, {active, path, range, changeFunctionId, startValue}) => {

            console.log(path, active);
            if (!active) return res;

            const changeFunctionData = changeFunctions[changeFunctionId];

            const changeFunction = changeFunctionByType[changeFunctionData.type];

            let nextValue = changeFunction(changeFunctionData.params, range)(startValue, action.time);
            nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);

            return res.set(path, nextValue)
        }, immutable.wrap(state)).value();
    },
    [EChangeAction.TO_START_VALUE]: (state: AppState, action: ChangeToStartValueAction) => {
        const {path} = action;
        const {changingValues} = state;

        return changingValues[path]
            ? immutable.wrap(state).set(path, changingValues[path].startValue).value()
            : state;
    },
    [EChangeAction.ALL_TO_START_VALUE]: (state: AppState) => {
        const {changingValues} = state;

        return Object.values(changingValues).reduce((res, {active, path, range, changeFunctionId, startValue}) => {
            return res.set(path, startValue)
        }, immutable.wrap(state)).value();
    },
}, {});