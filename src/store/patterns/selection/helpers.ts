import {Segments, SelectionParams, SelectionValue} from "./types";
import {PatternState} from "../pattern/types";
import {imageDataToCanvas} from "../../../utils/canvas/helpers/imageData";
import {createCanvas} from "../../../utils/canvas/helpers/base";
import {pathDataToString} from "../../../utils/path";
import {getFunctionState} from "../../../utils/patterns/function";

export const getSelectionState = getFunctionState<SelectionValue, SelectionParams>({
    segments: [],
    bBox: null,
    mask: null
}, {});

export const getMaskFromSegments = (width, height, selectionValue: Segments) => {

    const {context} = createCanvas(width, height);

    const path = new Path2D(pathDataToString(selectionValue));

    context.fillStyle = "black";
    context.fill(path);

    return context.getImageData(0, 0, width, height);

};

export const getSelectedImageData = (pattern: PatternState): ImageData => {
    const bbox = pattern.selection.value.bBox;
    const maskImageData = getMaskFromSegments(pattern.current.width, pattern.current.height, pattern.selection.value.segments);

    const {context} = createCanvas(pattern.current.width, pattern.current.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }
    context.drawImage(imageDataToCanvas(pattern.current.imageData), 0, 0, pattern.current.width, pattern.current.height);

    context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);


    return context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);

};
export const getSelectedMask = (pattern: PatternState): ImageData => {
    const bbox = pattern.selection.value.bBox;
    const maskImageData = getMaskFromSegments(pattern.current.width, pattern.current.height, pattern.selection.value.segments);

    const {context} = createCanvas(pattern.current.width, pattern.current.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }

    if ( pattern.mask ) {
        context.drawImage(imageDataToCanvas(pattern.mask.value.imageData), 0, 0, pattern.current.width, pattern.current.height)
    } else {
        context.fillStyle = 'black';
        context.fillRect(0,0, pattern.current.width, pattern.current.height);
    }

    context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);


    return context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);

};

