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
import {getRoomState} from "./room/helpers";
import {getMaskedImage, imageDataToCanvas} from "../../utils/canvas/helpers/imageData";
import {getBlurState} from "./blur/helpers";

export const patternId = (state: PatternsState) =>
    (Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1).toString();


export const createPatternInitialState = (id: string, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating, startImage, startMask, blur} = config || {};

    const width = startImage ? startImage.width : (config.width || 300);
    const height = startImage ? startImage.height : (config.height || 300);

    const current = startImage ? createCanvasStateFromImageData(startImage) : createCleanCanvasState(width, height);
    return {
        id,
        config,
        resultImage: startMask ? getMaskedImage(current.imageData, startMask) : imageDataToCanvas(current.imageData),
        current,
        history: getHistoryState(history, undefined, (params || {}).history),
        store: getStoreState(store, undefined, (params || {}).store),
        selection: getSelectionState(selection, undefined, (params || {}).selection),
        mask: getMaskState(width, height, startMask)(mask, undefined, (params || {}).mask),
        rotation: getRotationState(rotation, undefined, (params || {}).rotation),
        repeating: getRepeatingState(repeating, undefined, (params || {}).repeating),
        import: getImportState(true, undefined, (params || {}).import),
        video: getVideoState(true, undefined, (params || {}).video),
        room: getRoomState(true, undefined, (params || {}).room),
        blur: getBlurState(true, undefined, (params || {}).blur),
    }
};

export const updatePatternState = (state: PatternState, config: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating} = config || {};
    params = params || {};
    const maskState = getMaskState(state.current.width, state.current.height)(mask, state.mask, params.mask);
    return {
        config,
        id: state.id,
        current: state.current,
        resultImage: maskState ? getMaskedImage(state.current.imageData, maskState.value.imageData) : getMaskedImage(state.current.imageData),
        // resultImage: state.resultImage,
        history: getHistoryState(history, state.history, params.history),
        store: getStoreState(store, state.store, params.store),
        selection: getSelectionState(selection, state.selection, params.selection),
        mask: maskState,
        rotation: getRotationState(rotation, state.rotation, params.rotation),
        repeating: getRepeatingState(repeating, state.repeating, params.repeating),
        import: getImportState(true, state.import, params.import),
        video: getVideoState(true, state.video, params.video),
        room: getRoomState(true, state.room, params.room),
        blur: getBlurState(true, state.blur, params.blur),
    }
};



export const removePattern = (state: PatternsState, id: string) => omit(state, id);


