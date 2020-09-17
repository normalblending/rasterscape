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
import {getBlurState} from "./blur/helpers";
import {patternValues} from "./values";
import {getDemonstrationState} from "./demonstration/helpers";

export const patternId = (state: PatternsState) =>
    (Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1).toString();


export const createPatternInitialState = (id: string, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating, startImage, startMask, room} = config || {};

    const width = startImage ? startImage.width : (config.width || 300);
    const height = startImage ? startImage.height : (config.height || 300);

    const current = startImage ? createCanvasStateFromImageData(startImage) : createCleanCanvasState(width, height);
    const patternState = {
        id,
        config,
        resultImage: patternValues.setValue(id, current.imageData, mask && startMask),
        current,
        history: getHistoryState(history, undefined, params?.history),
        store: getStoreState(store, undefined, params?.store),
        selection: getSelectionState(selection, undefined, params?.selection),
        mask: getMaskState(width, height, startMask)(mask, undefined, params?.mask),
        rotation: getRotationState(rotation, undefined, params?.rotation),
        repeating: getRepeatingState(repeating, undefined, params?.repeating),
        import: getImportState(true, undefined, params?.import),
        video: getVideoState(true, undefined, params?.video),
        room: getRoomState(true, undefined, params?.room),
        blur: getBlurState(true, undefined, params?.blur),
        demonstration: getDemonstrationState(true, undefined, params?.demonstration),
    }

    return patternState;
};

export const updatePatternState = (state: PatternState, config: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating, room} = config || {};
    params = params || {};
    const maskState = getMaskState(state.current.width, state.current.height)(true, state.mask, params.mask);
    return {
        config,
        id: state.id,
        current: state.current,
        resultImage: patternValues.setValue(state.id, state.current.imageData, mask && maskState?.value.imageData),
        // resultImage: state.resultImage,
        history: getHistoryState(history, state.history, params.history),
        store: getStoreState(store, state.store, params.store),
        selection: getSelectionState(selection, state.selection, params.selection),
        mask: maskState,
        rotation: getRotationState(true, state.rotation, params.rotation),
        repeating: getRepeatingState(true, state.repeating, params.repeating),
        import: getImportState(true, state.import, params.import),
        video: getVideoState(true, state.video, params.video),
        room: getRoomState(true, state.room, params.room),
        blur: getBlurState(true, state.blur, params.blur),
        demonstration: getDemonstrationState(false, state.demonstration, params.demonstration),
    }
};



export const removePattern = (state: PatternsState, id: string) => omit(state, id);


