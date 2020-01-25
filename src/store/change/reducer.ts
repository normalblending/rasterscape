import {handleActions} from "redux-actions";
import * as immutable from 'object-path-immutable';
import {AppState} from "../index";
import {ChangeAction, ChangeToStartValueAction, EChangeAction} from "./actions";
import {changeFunctionByType} from "../changeFunctions/helpers";
import {act} from "react-dom/test-utils";
import {position} from "../../components/Area/canvasPosition.servise";


export const changeReducer = handleActions<AppState>({
    [EChangeAction.CHANGE]: (state: AppState, action: ChangeAction) => {
        // console.log(state, action.time, action.position);

        const {changeFunctions, changingValues, patterns} = state;


        return Object.values(changingValues).reduce((res, {active, path, range, changeFunctionId, startValue}) => {

            const pattern = patterns[action.position.patternId];
            // console.log(path, active);
            if (!active) return res;

            const changeFunctionData = changeFunctions[changeFunctionId];

            const changeFunction = changeFunctionByType[changeFunctionData.type];

            // console.log(changeFunction(changeFunctionData.params, range, pattern)(startValue, action.time, action.position), changeFunctionData.params, range, pattern, startValue, action.time, action.position);

            let nextValue = changeFunction({
                params: changeFunctionData.params, range, pattern
            })({
                startValue,
                time: action.time,
                position: action.position
            });
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