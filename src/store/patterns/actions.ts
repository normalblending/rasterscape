import {
    AddPatternAction, CreatePatternFromSelection,
    CreateRoomAction,
    EditPatternConfigAction, LoadAction, LoadingParams,
    MaskParams, PatternParams,
    PatternRedoAction,
    PatternUndoAction,
    RemovePatternAction, RepeatingParams, RotationValue, SaveAction, Segments, SetLoadingParamsAction,
    SetMaskParamsAction,
    SetPatternHeightAction,
    SetPatternWidthAction, SetRepeatingAction,
    SetRotationAction,
    UpdatePatternImageAction,
    UpdatePatternMaskAction,
    UpdatePatternSelectionAction
} from "./types";
import {SelectionValue} from "./types";
import {PatternConfig} from "./types";
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AppState} from "../index";
import {Action} from "redux";
import {createRoom_s} from "./service";
import {
    base64ToImageData,
    canvasToImageData,
    imageDataToBase64,
    imageDataToCanvas,
    imageToImageData
} from "../../utils/canvas/imageData";
import {dispatch} from "d3-dispatch";
import {randomZ} from "../../utils/utils";
import {getPatternConfig, getPatternParams, getSelectedImageData} from "./helpers";
import {createCanvas} from "../../utils/canvas/canvas";
import {boundingBox, getMaskFromSegments, pathDataToString} from "../../utils/path";

type ThunkResult<R> = ThunkAction<R, AppState, undefined, Action>;

export enum EPatternsAction {
    ADD_PATTERN = "patterns/add",
    REMOVE_PATTERN = "patterns/remove",
}

export enum EPatternAction {
    UPDATE_IMAGE = "pattern/update-image",
    UPDATE_MASK = "pattern/update-mask",
    UPDATE_SELECTION = "pattern/update-selection",
    SET_MASK_PARAMS = "pattern/set-mask-params",
    EDIT_CONFIG = "pattern/edit-config",
    UNDO = "pattern/undo",
    REDO = "pattern/redo",
    STORE_IMAGE = "pattern/store-image",
    UNSTORE_IMAGE = "pattern/unstore-image",
    SET_WIDTH = "pattern/set-width",
    SET_HEIGHT = "pattern/set-height",
    SET_SELECTION_PARAMS = "pattern/set-selection-params",
    SET_ROTATION = "pattern/set-rotation",
    SET_REPEATING = "pattern/set-repeating",
    SET_LOADING_PARAMS = "pattern/set-loading-params",
    LOAD = "pattern/load",
    SAVE = "pattern/save",

    CREATE_ROOM = "pattern/create-room",
}

export const addPattern = (config?: PatternConfig, params?: PatternParams): AddPatternAction =>
    ({type: EPatternsAction.ADD_PATTERN, config, params});

export const removePattern = (id: string): RemovePatternAction =>
    ({type: EPatternsAction.REMOVE_PATTERN, id});

export const updateImage = (id: string, imageData: ImageData, emit: boolean = true): ThunkResult<UpdatePatternImageAction> =>
    (dispatch, getState) => {

        const socket = getState().patterns[id].socket;

        emit && socket && socket.emit("image", imageDataToBase64(imageData));

        return dispatch({type: EPatternAction.UPDATE_IMAGE, imageData, id});
    };

export const updateMask = (id: string, imageData: ImageData): UpdatePatternMaskAction =>
    ({type: EPatternAction.UPDATE_MASK, imageData, id});

export const setMaskParams = (id: string, params: MaskParams): SetMaskParamsAction =>
    ({type: EPatternAction.SET_MASK_PARAMS, id, params});

export const updateSelection = (id: string, value: Segments, bBox: SVGRect): UpdatePatternSelectionAction =>
    ({type: EPatternAction.UPDATE_SELECTION, value, bBox, id});

export const editConfig = (id: string, config: PatternConfig): EditPatternConfigAction =>
    ({type: EPatternAction.EDIT_CONFIG, id, config});

export const undo = (id: string): PatternUndoAction =>
    ({type: EPatternAction.UNDO, id});
export const redo = (id: string): PatternRedoAction =>
    ({type: EPatternAction.REDO, id});

export const setWidth = (id: string, width: number): SetPatternWidthAction =>
    ({type: EPatternAction.SET_WIDTH, id, width});
export const setHeight = (id: string, height: number): SetPatternHeightAction =>
    ({type: EPatternAction.SET_HEIGHT, id, height});


export const setRotation = (id: string, rotation: RotationValue): SetRotationAction =>
    ({type: EPatternAction.SET_ROTATION, id, rotation});


export const setRepeating = (id: string, repeating: RepeatingParams): SetRepeatingAction =>
    ({type: EPatternAction.SET_REPEATING, id, repeating});


export const doublePattern = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    const config = getPatternConfig(pattern);
    const params = getPatternParams(pattern);

    dispatch(addPattern(config, params));
};

export const createPatternFromSelection = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    const config = getPatternConfig(pattern);
    const params = getPatternParams(pattern);

    config.startImage = getSelectedImageData(pattern);

    dispatch(addPattern(config, params));
};

export const cutPatternBySelection = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    dispatch(updateImage(id, getSelectedImageData(pattern)));
    dispatch(updateSelection(id, [], null));
};

export const setLoadingParams = (id: string, value: LoadingParams): SetLoadingParamsAction =>
    ({type: EPatternAction.SET_LOADING_PARAMS, id, value});

export const load = (id: string, image) => (dispatch, getState) => {

    const imageData = imageToImageData(image);

    const state: AppState = getState();

    const isFit = state.patterns[id].loading.params.fit;

    if (isFit) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }



        const oldWidth = state.patterns[id].current.width;
        const oldHeight = state.patterns[id].current.height;

        canvas.width = oldWidth;
        canvas.height = oldHeight;

        ctx.drawImage(image, 0, 0, oldWidth, oldHeight);





        const imageData2 = ctx.getImageData(0,0, oldWidth, oldHeight);
        dispatch(updateImage(id, imageData2));

    } else {

        dispatch(updateImage(id, imageData));
    }


    dispatch({type: EPatternAction.LOAD, id, imageData});
};
export const save = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }


    canvas.width = state.patterns[id].current.width;
    canvas.height = state.patterns[id].current.height;

    ctx.putImageData(state.patterns[id].current.imageData, 0, 0);



    var dataURL = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    document.body.appendChild(link); // Firefox requires the link to be in the body :(
    link.href = dataURL;
    link.download = `${randomZ()}.png`;
    link.click();
    document.body.removeChild(link);




    dispatch({type: EPatternAction.SAVE, id});
};


export const createRoom = (id: string, roomName: string): ThunkResult<CreateRoomAction> =>
    dispatch => {
        const socket = createRoom_s(roomName);

        socket.on("image", base64 => {
            base64ToImageData(base64).then(imageData => {
                dispatch(updateImage(id, imageData, false));
            });
        });

        return dispatch({type: EPatternAction.CREATE_ROOM, id, roomName, socket})
    };

// export const storeImage = (id: string): PatternStoreAction => ({type: EPatternsAction.STORE_IMAGE});
// export const unstoreImage = (id: string): PatternUnstoreAction => ({type: EPatternsAction.UNSTORE_IMAGE});

// export const setSelection = (selection: SelectionValue): SetPatternSelectionAction =>
//     ({type: EPatternsAction.SET_SELECTION, selection});
// export const setSelectionParams = (params: object): SetPatternSelectionParamsAction =>
//     ({type: EPatternsAction.SET_SELECTION_PARAMS, params});