import {
    AddPatternAction,
    EPatternType,
    PatternRedoAction, PatternStoreAction, PatternUndoAction, PatternUnstoreAction, RemovePatternAction,
    SetPatternHeightAction,
    SetPatternSelectionAction,
    SetPatternSelectionParamsAction,
    SetPatternWidthAction, UpdatePatternImageAction
} from "./types";
import {SelectionValue} from "../../utils/types";

export enum EPatternsAction {
    ADD_PATTERN = "patterns/add",
    REMOVE_PATTERN = "patterns/remove",
    UPDATE_IMAGE = "patterns/update-image",
    UNDO = "patterns/undo",
    REDO = "patterns/redo",
    STORE_IMAGE = "patterns/store-image",
    UNSTORE_IMAGE = "patterns/unstore-image",
    SET_WIDTH = "patterns/set-width",
    SET_HEIGHT = "patterns/set-height",
    SET_SELECTION = "patterns/set-selection",
    SET_SELECTION_PARAMS = "patterns/set-selection-params",
}

export const addPattern = (patternType: EPatternType): AddPatternAction =>
    ({type: EPatternsAction.ADD_PATTERN, patternType});

export const removePattern = (id: number): RemovePatternAction =>
    ({type: EPatternsAction.REMOVE_PATTERN, id});

export const updateImage = (id: number, imageData: ImageData): UpdatePatternImageAction =>
    ({type: EPatternsAction.UPDATE_IMAGE, imageData, id});

// export const undo = (id: number): PatternUndoAction =>
//     ({type: EPatternsAction.UNDO});
// export const redo = (id: number): PatternRedoAction =>
//     ({type: EPatternsAction.REDO});
// export const storeImage = (id: number): PatternStoreAction => ({type: EPatternsAction.STORE_IMAGE});
// export const unstoreImage = (id: number): PatternUnstoreAction => ({type: EPatternsAction.UNSTORE_IMAGE});
// export const setWidth = (id: number, width: number): SetPatternWidthAction =>
//     ({type: EPatternsAction.SET_WIDTH, width});
// export const setHeight = (id: number, height: number): SetPatternHeightAction =>
//     ({type: EPatternsAction.SET_HEIGHT, height});
// export const setSelection = (selection: SelectionValue): SetPatternSelectionAction =>
//     ({type: EPatternsAction.SET_SELECTION, selection});
// export const setSelectionParams = (params: object): SetPatternSelectionParamsAction =>
//     ({type: EPatternsAction.SET_SELECTION_PARAMS, params});