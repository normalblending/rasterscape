import {handleActions} from "redux-actions";

export enum EFullScreenAction {
    ON = "fullscreen/on",
    OFF = "fullscreen/off",
    SET = "fullscreen/set",
    REVERSE = "fullscreen/reverse",
}

export type FullScreenState = boolean;

export const fullscreenReducer = handleActions<FullScreenState>({
    [EFullScreenAction.ON]: () => true,
    [EFullScreenAction.OFF]: () => false,
    [EFullScreenAction.SET]: (s, a) => a.value,
    [EFullScreenAction.REVERSE]: (s) => !s,
}, false);

export const goFullScreen = () => ({
    type: EFullScreenAction.ON
});
export const setFullScreen = (value: boolean) => ({
    type: EFullScreenAction.SET, value
});
export const reverseFullScreen = () => ({
    type: EFullScreenAction.REVERSE
});