import {handleActions} from "redux-actions";
import {Action} from "redux";

/** это должны быть включаемые через редакс сообщения (окна)
 *
 * при инициализации смотрим на то есть ли паттерн, если нету то надпись рядом с кнопкой
 *
 * дальше все по отдельности крооме некоторых связок
 *
 * [инструменты]
 * [кисть]:
 *   [тип кисти]: {
 *       паттерн
 *       написать что можно рисовать другим канвасом
 *   }
 *
 *   { размер кисти :
 *          [круг/квадрат]: как изменятьь, что значит точка, горячая кнопка, функция изменения (ссылка), уупомянуть что для паттерна другая схема
 *
 *          для паттерна другая схема
 *    }
 *   [прозрачность]
 *   [режим наложения]
 *
 *
 *
 *
 * */


export enum Messages {
    BrushSize = 'brush-size',
}

export enum ETutorialAction {
    ACTIVATE = "tutorial/activate",
    SET_STATE = "tutorial/set-state",
}

export interface TutorialMessage {
    id: string
    active: boolean
}

export interface TutorialMessages {
    [id: string]: TutorialMessage
}

export interface TutorialState {
    on: boolean
    messages: TutorialMessages
}

export const tutorialReducer = handleActions<TutorialState>({
    [ETutorialAction.ACTIVATE]: (state: TutorialState, action: ActivateTutorialAction) => {

        return {
            ...state,
            on: !state.on
        }
    },
    [ETutorialAction.SET_STATE]: (state: TutorialState, action: SetStateTutorialAction) => {
        return {
            ...state,
            messages: {
                ...state.messages,
                [action.id]: {
                    ...state.messages[action.id],
                    active: action.active
                }
            }
        }
    },
}, {
    on: true,
    messages: {
        'brush-size': {id: 'brush-size', active: false}
    }
});


export interface SetStateTutorialAction extends Action {
    id: string
    active: boolean
}

export const setStateTutorial = (id: string, active: boolean): SetStateTutorialAction => ({
    type: ETutorialAction.SET_STATE, id, active
});

export interface ActivateTutorialAction extends Action {
}

export const activateTutorial = (): ActivateTutorialAction => ({
    type: ETutorialAction.ACTIVATE
});

