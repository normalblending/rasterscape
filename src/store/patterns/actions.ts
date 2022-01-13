import {AddPatternAction, PatternConfig, PatternParams} from "./pattern/types";
import {leaveRoom} from "./room/actions";
import {EPatternsAction} from "./consts";
import {patternsService} from "./../index";
import {AppState} from "../index";
import {patternId} from "./helpers";
import {initHistory} from "./history/actions";
import {EToolType} from "../tool/types";
import {imageDataDebug} from "../../components/Area/canvasPosition.servise";

// TODO типы


export const addPattern = (config?: PatternConfig, params?: PatternParams) => (dispatch, getState: () => AppState) => {

    const state = getState();
    const id = patternId(Object.keys(state.patterns));
    const startImage = config.startImage || new ImageData(config.width || 400, config.height || 400);
    const startMask = config.startMask || new ImageData(config.width || 400, config.height || 400);
    const width = startImage.width;
    const height = startImage.height;

    const tool = state.tool.current;
    const toolType = {
        [EToolType.Brush]: state.brush.params.brushType,
        [EToolType.Line]: state.line.params.type,
    }[tool];

    patternsService.addPattern(id)
        .maskService.setEnabled(config.mask)
        .maskService.setImageData(startMask)
        .canvasService.setImageData(startImage)
        .valuesService.update()
        .patternToolService.bindTool(tool, toolType, width, height)
        // .setRotationAngle(params.rotation.);


    dispatch({
        type: EPatternsAction.ADD_PATTERN,
        id,
        params,
        config: {
            ...config,
            width,
            height
        }
    });

    dispatch(initHistory(id))
}

export const removePattern = (id: string) => (dispatch, getState) => {

    dispatch(leaveRoom(id));

    dispatch({type: EPatternsAction.REMOVE_PATTERN, id});

    patternsService.deletePattern(id);
}

