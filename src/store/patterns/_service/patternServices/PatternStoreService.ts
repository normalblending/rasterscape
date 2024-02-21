import {PatternService} from "../PatternService";
import {AppState} from "../../../index";
import {AnyAction, Store} from "redux";
import {PatternState} from "../../pattern/types";
import {BrushShapeParams, EBrushType} from "../../../brush/types";
import {pushPosition, resetPosition, setPosition} from "../../../position";
import {ThunkDispatch} from "redux-thunk";
import {coordHelper5} from "../../../../components/Area/canvasPosition.servise";

export class PatternStoreService {
    patternService: PatternService;
    store: Store<AppState>;

    constructor(patternService: PatternService, store: Store<AppState>) {
        this.patternService = patternService;
        this.store = store;
    }

    dispatchPushPosition = (e: MouseEvent) => {
        // coordHelper5.setText(111, e.offsetX, e.offsetY);
        (this.store.dispatch as ThunkDispatch<AppState, undefined, AnyAction>)(pushPosition(this.patternService.patternId, e.offsetX, e.offsetY))
    };

    dispatchResetPosition = () => {
        // coordHelper5.setText(111, e.offsetX, e.offsetY);
        (this.store.dispatch as ThunkDispatch<AppState, undefined, AnyAction>)(resetPosition(this.patternService.patternId));
    };

    getState = (): AppState => {
        return this.store.getState();
    };

    getPatternState = (): PatternState => {
        return this.store.getState().patterns[this.patternService.patternId];
    };

    getBrushShapeParams = (): BrushShapeParams => {
        return this.store.getState().brush.params[EBrushType.Shape];
    };

    getVideoCutFunctionParams = (): BrushShapeParams => {
        return this.store.getState().brush.params[EBrushType.Shape];
    };
}

