import {createCanvas} from "./base";

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
export const drawMaskedWithRotation = (
    maskImageData: ImageData,
    angle: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction
) => {
    const {canvas, context} = drawMasked(maskImageData, drawWithRotation(angle, x, y, draw));

    return {canvas, context};
};


/**
 *  angle
 *  angle + xd yd
 *  xc yc
 *  angle + xc yc
 *  angle + xd yd + xc yc
 * */
export const drawWithRotationAndOffset = (
    angleB: number,
    angleD: number,
    xc: number, yc: number,
    xd: number, yd: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
) => ({context, canvas}) => {

    context.translate(x, y);

    context.rotate(-Math.PI * angleD / 180);
    context.translate(xd, yd);

    context.translate(xc, yc);
    context.rotate(Math.PI * angleB / 180);
    context.translate(-xc, -yc);

    draw({canvas, context});

    context.resetTransform();

    return {canvas, context};
};
