import {HistoryParams, HistoryState, HistoryValue, PatternHistoryItem} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getHistoryState = getFunctionState<HistoryValue, HistoryParams>({
    before: [],
    after: [],
}, {
    length: 4
});
export const historyPush = (history: HistoryState, current: PatternHistoryItem): HistoryState => {
    const {value: {before}, params: {length: historyLength}} = history;

    const beforeNext: PatternHistoryItem[] = [...before, current];
    const afterNext: PatternHistoryItem[] = [];

    if (beforeNext.length > historyLength)
        beforeNext.shift();

    return {
        ...history,
        value: {
            before: beforeNext,
            after: afterNext
        }
    }
};

export interface PatternUndoResult {
    history: HistoryState
    prev: PatternHistoryItem
}

export const historyUndo = (history: HistoryState, current: PatternHistoryItem): PatternUndoResult => {
    const {value: {before, after}} = history;

    if (before.length === 0) return null;

    const prev = before[before.length - 1];

    const beforeNext = before.slice(0, before.length - 1); // pop
    const afterNext = [current, ...after]; // unshift current

    return {
        history: {
            ...history,
            value: {
                before: beforeNext,
                after: afterNext
            }
        },
        prev
    }
};

export interface PatternRedoResult {
    history: HistoryState
    next: PatternHistoryItem
}

export const historyRedo = (history: HistoryState, current: PatternHistoryItem): PatternRedoResult => {
    const {value: {before, after}} = history;

    if (after.length === 0) return null;

    const next = after[0];

    const beforeNext = [...before, current]; // push current
    const afterNext = after.slice(1, after.length); // shift

    return {
        history: {
            ...history,
            value: {
                before: beforeNext,
                after: afterNext
            }
        },
        next
    }
};