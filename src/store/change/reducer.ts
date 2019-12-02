import {handleActions} from "redux-actions";
import * as immutable from 'object-path-immutable';
import {AppState} from "../index";
import {EChangeAction} from "./actions";
import {changeFunctionByType} from "../changeFunctions/helpers";

export const changeReducer = handleActions<AppState>({
    [EChangeAction.CHANGE]: (state: AppState, action) => {
        console.log(state, action.time);

        const {changeFunctions} = state;


        return Object.values(state.changingValues).reduce((res, {path, range, changeFunctionId, startValue}) => {

            const changeFunctionData = changeFunctions[changeFunctionId];

            const changeFunction = changeFunctionByType[changeFunctionData.type];

            let nextValue = changeFunction(changeFunctionData.params, range)(startValue, action.time);
            nextValue = Math.min(Math.max(nextValue, range[0]), range[1]);

            return res.set(path, nextValue)
        }, immutable.wrap(state)).value();
    }
}, {});