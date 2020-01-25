import {createCanvas} from "./base";
import {RotationValue} from "../../../store/patterns/rotating/types";

export interface DrawMaskedDrawFunctionParams {
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
}

export type DrawMaskedDrawFunction = ({context, canvas}: DrawMaskedDrawFunctionParams) => void;
export const drawMasked = (maskImageData: ImageData, draw: DrawMaskedDrawFunction) => {
    const {canvas, context} = createCanvas(maskImageData.width, maskImageData.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }

    draw({context, canvas});

    return {canvas, context};
};
export const drawWithPositionAndRotation = (
    rotation: RotationValue,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
    rotationInverse?: boolean,
) => ({context, canvas}) => {

    if (rotation) {
        context.translate(x + rotation.offset.x * (rotationInverse ? -1 : 1), y + rotation.offset.y * (rotationInverse ? -1 : 1));
        context.rotate(Math.PI * rotation.angle / 180 * (rotationInverse ? -1 : 1));
    } else {
        context.translate(x, y);
    }

    draw({canvas, context});

    if (rotation) {
        context.rotate(-Math.PI * rotation.angle / 180 * (rotationInverse ? -1 : 1));
        context.translate(-x - rotation.offset.x * (rotationInverse ? -1 : 1), -y - rotation.offset.y * (rotationInverse ? -1 : 1));
    } else {
        context.translate(-x, -y);
    }

    return {canvas, context};
};
export const drawWithRotation = (
    angle: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
) => ({context, canvas}) => {

    context.translate(x, y);
    context.rotate(Math.PI * angle / 180);

    draw({canvas, context});


    context.rotate(-Math.PI * angle / 180);
    context.translate(-x, -y);

    return {canvas, context};
};
export const drawWithPosition = (
    x: number, y: number,
    draw: DrawMaskedDrawFunction
) => ({context, canvas}) => {

    context.translate(x, y);

    draw({canvas, context});

    context.translate(-x, -y);

    return {canvas, context};
};
export const drawMaskedWithPositionAndRotation = (
    maskImageData: ImageData,
    rotation: RotationValue,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
    rotationInverse?: boolean
) => {
    const {canvas, context} = drawMasked(maskImageData, drawWithPositionAndRotation(rotation, x, y, draw, rotationInverse));

    return {canvas, context};
};
export const drawMaskedWithPosition = (
    maskImageData: ImageData,
    x: number, y: number,
    draw: DrawMaskedDrawFunction
) => {
    const {canvas, context} = drawMasked(maskImageData, drawWithPosition(x, y, draw));

    return {canvas, context};
};
export const drawMaskedWithRotation = (
    maskImageData: ImageData,
    angle: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction
) => {
    const {canvas, context} = drawMasked(maskImageData, drawWithRotation(angle, x, y, draw));

    return {canvas, context};
};
export const drawWithMask = (maskImageData, rotation) => (x, y, patternImage, dx, dy, w, h): HTMLCanvasElement => {

    const {canvas} = drawMasked(maskImageData, ({context}) => {
        if (rotation) {
            context.translate(x + rotation.offset.x, y + rotation.offset.y);
            context.rotate(Math.PI * rotation.angle / 180);
        } else {
            context.translate(x, y);
        }

        context.drawImage(patternImage, dx, dy, w, h);

        if (rotation) {
            context.rotate(-Math.PI * rotation.angle / 180);
            context.translate(-x - rotation.offset.x, -y - rotation.offset.y);
        } else {
            context.translate(-x, -y);
        }
    });

    return canvas;
};