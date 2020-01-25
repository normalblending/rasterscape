import {createCanvasStateFromImageData, createCleanCanvasState} from "../../utils/state";
import {omit} from "lodash";
import {PatternsState} from "./types";
import {PatternConfig, PatternParams, PatternState} from "./pattern/types";
import {getHistoryState} from "./history/helpers";
import {getStoreState} from "./store/helpers";
import {getSelectionState} from "./selection/helpers";
import {getMaskState} from "./mask/helpers";
import {getRotationState} from "./rotating/helpers";
import {getRepeatingState} from "./repeating/helpers";
import {getImportState} from "./import/helpers";
import {getVideoState} from "./video/helpers";

export const patternId = (state: PatternsState) =>
    (Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1).toString();


export const createPatternInitialState = (id: string, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating, startImage} = config || {};

    const width = startImage ? startImage.width : (config.width || 300);
    const height = startImage ? startImage.height : (config.height || 300);

    return {
        id,
        config,
        resultImage: null,
        current: startImage ? createCanvasStateFromImageData(startImage) : createCleanCanvasState(width, height),
        history: getHistoryState(history, undefined, (params || {}).history),
        store: getStoreState(store, undefined, (params || {}).store),
        selection: getSelectionState(selection, undefined, (params || {}).selection),
        mask: getMaskState(width, height)(mask, undefined, (params || {}).mask),
        rotation: getRotationState(rotation, undefined, (params || {}).rotation),
        repeating: getRepeatingState(repeating, undefined, (params || {}).repeating),
        import: getImportState(true, undefined, (params || {}).import),
        video: getVideoState(true, undefined, (params || {}).video),
    }
};

export const updatePatternState = (state: PatternState, config: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating} = config || {};
    params = params || {};
    return {
        config,
        id: state.id,
        current: state.current,
        resultImage: state.resultImage,
        history: getHistoryState(history, state.history, params.history),
        store: getStoreState(store, state.store, params.store),
        selection: getSelectionState(selection, state.selection, params.selection),
        mask: getMaskState(state.current.width, state.current.height)(mask, state.mask, params.mask),
        rotation: getRotationState(rotation, state.rotation, params.rotation),
        repeating: getRepeatingState(repeating, state.repeating, params.repeating),
        import: getImportState(true, state.import, params.import)
    }
};



export const removePattern = (state: PatternsState, id: string) => omit(state, id);


