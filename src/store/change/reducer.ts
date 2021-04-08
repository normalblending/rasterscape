import {handleActions} from "redux-actions";
import * as immutable from 'object-path-immutable';
import {AppState} from "../index";
import {ChangeAction, ChangeToStartValueAction, EChangeAction} from "./actions";
import {changeFunctionFactory} from "../changeFunctions/factory";

export const changeReducer = handleActions<AppState>({
    [EChangeAction.CHANGE]: (state: AppState, action: ChangeAction) => {
        // console.log(state, action.time, action.position);

        const {changeFunctions: {functions: changeFunctions}, changingValues, patterns, position} = state;

        let r;

        r = Object.values(changingValues).reduce((res, changingValue) => {

            let vPath, nextValue;

            // for (let i = 0; i < position.coordinates.length; i++) {
                const {
                    active,
                    path,
                    range,
                    changeFunctionId,
                    startValue
                } = changingValue;

                const pattern = patterns[action.position.patternId];

                // console.log(path, active);
                if (!active) return res;

                const changeFunctionData = changeFunctions[changeFunctionId];

                const changeFunction = changeFunctionFactory.getFunction(changeFunctionId + '-' + path, changeFunctionData.type);

                // console.log(changeFunction(changeFunctionData.params, range, pattern)(startValue, action.time, action.position), changeFunctionData.params, range, pattern, startValue, action.time, action.position);

                // let nextValue = changeFunction({
                console.log(1, pattern);
                nextValue = changeFunction({
                    params: changeFunctionData.params,
                    range,
                    pattern,
                    startValue,
                    time: action.time,
                    position: action.position
                });

                if (nextValue === undefined)
                    return res;

                nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);

                vPath = path
            // }

            return res.set(vPath, nextValue)
        }, immutable.wrap(state)).value();

        return r;
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