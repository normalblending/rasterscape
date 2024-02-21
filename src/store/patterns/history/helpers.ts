import {HistoryParams, HistoryState, HistoryValue, PatternHistoryItem} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getHistoryState = getFunctionState<HistoryValue, HistoryParams>({
    before: [],
    after: [],
    current: null
}, {
    length: 23
});

export const historyInit = (history: HistoryState, current: PatternHistoryItem): HistoryState => {
    return {
        ...history,
        value: {
            before: [],
            after: [],
            current
        }
    }
};
export const historyPush = (history: HistoryState, newCurrent: PatternHistoryItem): HistoryState => {
    const {value, params: {length: historyLength}} = history;

    const beforeNext: PatternHistoryItem[] = [...value.before, value.current];
    const afterNext: PatternHistoryItem[] = [];

    if (beforeNext.length > historyLength)
        beforeNext.shift();

    return {
        ...history,
        value: {
            before: beforeNext,
            after: afterNext,
            current: newCurrent
        }
    }
};

export interface PatternUndoResult {
    history: HistoryState
    prev: PatternHistoryItem
}

export const historyUndo = (history: HistoryState, newCurrent: PatternHistoryItem): HistoryState => {
    const {value} = history;

    if (value.before.length === 0) return null;

    const prev = value.before[value.before.length - 1];

    const beforeNext = value.before.slice(0, value.before.length - 1); // pop
    const afterNext = [newCurrent, ...value.after]; // unshift current

    return {
        ...history,
        value: {
            before: beforeNext,
            after: afterNext,
            current: prev,
        }
    }
};

export interface PatternRedoResult {
    history: HistoryState
    next: PatternHistoryItem
}

export const historyRedo = (history: HistoryState, newCurrent: PatternHistoryItem): HistoryState => {
    const {value} = history;

    if (value.after.length === 0) return null;

    const next = value.after[0];

    const beforeNext = [...value.before, newCurrent]; // push current
    const afterNext = value.after.slice(1, value.after.length); // shift

    return {
        ...history,
        value: {
            before: beforeNext,
            after: afterNext,
            current: next
        }
    }
};
