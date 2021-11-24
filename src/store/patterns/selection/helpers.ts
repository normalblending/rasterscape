import {Segments, SelectionParams, SelectionValue} from "./types";
import {PatternState} from "../pattern/types";
import {getMaskedImage, imageDataToCanvas, maskInverse} from "../../../utils/canvas/helpers/imageData";
import {createCanvas} from "../../../utils/canvas/helpers/base";
import {pathDataToString} from "../../../utils/path";
import {getFunctionState} from "../../../utils/patterns/function";

export const getSelectionState = getFunctionState<SelectionValue, SelectionParams>({
    segments: [],
    bBox: null,
    mask: null
}, {});

export const getMaskFromSegments = (width, height, selectionValue: Segments): ImageData => {

    const {context} = createCanvas(width, height);

    const path = new Path2D(pathDataToString(selectionValue));

    console.log(selectionValue, path);
    context.fillStyle = "black";
    context.fill(path);

    return context.getImageData(0, 0, width, height);

};

export const getSelectedImageData = (pattern: PatternState, withMask?: boolean, inverse?: boolean): ImageData => {

    const {current, mask} = pattern;
    const {imageData, } = current;
    const {width, height} = imageData;

    const maskedImage = withMask
        ? getMaskedImage(imageData, pattern.mask.value.imageData, pattern.mask.params.inverse)
        : imageDataToCanvas(imageData);

    if (!inverse) {

        const {width, height} = imageData;

        const bbox = pattern.selection.value?.bBox || {
            width,
            height,
            x: 0,
            y: 0,
        };

        const maskImageData = getMaskFromSegments(width, height, pattern.selection.value.segments);

        const {context} = createCanvas(width, height);

        if (maskImageData) {
            context.putImageData(
                maskImageData
                , 0, 0);
            context.globalCompositeOperation = "source-in";
        }
        context.drawImage(maskedImage, 0, 0, width, height);

        return context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);

    } else {
        const maskImageData = getMaskFromSegments(width, height, pattern.selection.value.segments);

        const {context} = createCanvas(width, height);

        if (maskImageData) {
            context.putImageData(
                maskInverse(maskImageData)
                , 0, 0);
            context.globalCompositeOperation = "source-in";
        }
        context.drawImage(maskedImage, 0, 0, width, height);

        // context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);


        return context.getImageData(0, 0, width, height);
    }
};
export const getSelectedMask = (pattern: PatternState): ImageData => {
    const bbox = pattern.selection.value.bBox;
    const maskImageData = getMaskFromSegments(pattern.current.imageData.width, pattern.current.imageData.height, pattern.selection.value.segments);

    const {context} = createCanvas(pattern.current.imageData.width, pattern.current.imageData.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }

    if (pattern.mask) {
        context.drawImage(imageDataToCanvas(pattern.mask.value.imageData), 0, 0, pattern.current.imageData.width, pattern.current.imageData.height)
    } else {
        context.fillStyle = 'black';
        context.fillRect(0, 0, pattern.current.imageData.width, pattern.current.imageData.height);
    }

    try {

        context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);


        return context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);
    } catch (e) {
        console.error(e);

        return new ImageData(0, 0);
    }

};

