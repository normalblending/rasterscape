import {
    AddPatternAction, EditPatternConfigAction,
    EPatternType,
    PatternRedoAction, PatternStoreAction, PatternUndoAction, PatternUnstoreAction, RemovePatternAction,
    SetPatternHeightAction,
    SetPatternSelectionAction,
    SetPatternSelectionParamsAction,
    SetPatternWidthAction, UpdatePatternImageAction, UpdatePatternSelectionAction
} from "./types";
import {SelectionValue} from "../../utils/types";
import {PatternConfig} from "./helpers";

export enum EPatternsAction {
    ADD_PATTERN = "patterns/add",
    REMOVE_PATTERN = "patterns/remove",
}

export enum EPatternAction {
    UPDATE_IMAGE = "pattern/update-image",
    UPDATE_SELECTION = "pattern/update-selection",
    EDIT_CONFIG = "pattern/edit-config",
    UNDO = "pattern/undo",
    REDO = "pattern/redo",
    STORE_IMAGE = "pattern/store-image",
    UNSTORE_IMAGE = "pattern/unstore-image",
    SET_WIDTH = "pattern/set-width",
    SET_HEIGHT = "pattern/set-height",
    SET_SELECTION_PARAMS = "pattern/set-selection-params",
}

export const addPattern = (config?: PatternConfig): AddPatternAction =>
    ({type: EPatternsAction.ADD_PATTERN, config});

export const removePattern = (id: number): RemovePatternAction =>
    ({type: EPatternsAction.REMOVE_PATTERN, id});

export const updateImage = (id: number, imageData: ImageData): UpdatePatternImageAction =>
    ({type: EPatternAction.UPDATE_IMAGE, imageData, id});

export const updateSelection = (id: number, value: SelectionValue): UpdatePatternSelectionAction =>
    ({type: EPatternAction.UPDATE_SELECTION, value, id});

export const editConfig = (id: number, config: PatternConfig): EditPatternConfigAction =>
    ({type: EPatternAction.EDIT_CONFIG, id, config});

export const undo = (id: number): PatternUndoAction =>
    ({type: EPatternAction.UNDO, id});
export const redo = (id: number): PatternRedoAction =>
    ({type: EPatternAction.REDO, id});

export const setWidth = (id: number, width: number): SetPatternWidthAction =>
    ({type: EPatternAction.SET_WIDTH, id, width});
export const setHeight = (id: number, height: number): SetPatternHeightAction =>
    ({type: EPatternAction.SET_HEIGHT, id, height});

// export const storeImage = (id: number): PatternStoreAction => ({type: EPatternsAction.STORE_IMAGE});
// export const unstoreImage = (id: number): PatternUnstoreAction => ({type: EPatternsAction.UNSTORE_IMAGE});

// export const setSelection = (selection: SelectionValue): SetPatternSelectionAction =>
//     ({type: EPatternsAction.SET_SELECTION, selection});
// export const setSelectionParams = (params: object): SetPatternSelectionParamsAction =>
//     ({type: EPatternsAction.SET_SELECTION_PARAMS, params});