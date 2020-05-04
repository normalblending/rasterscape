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