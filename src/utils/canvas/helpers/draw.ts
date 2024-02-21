import {HelperCanvas} from "./base";

export type DrawMaskedDrawFunction = (helperCanvas: HelperCanvas) => void;
export const drawMasked = (
    maskImageData: ImageData,
    draw: DrawMaskedDrawFunction,
) => (helperCanvas: HelperCanvas): HelperCanvas => {

    const {context} = helperCanvas;

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }

    draw(helperCanvas);

    return helperCanvas;
};
export const drawWithRotation = (
    angle: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
) => (helperCanvas: HelperCanvas): HelperCanvas => {

    helperCanvas.context.translate(x, y);
    helperCanvas.context.rotate(Math.PI * angle / 180);

    draw(helperCanvas);

    helperCanvas.context.rotate(-Math.PI * angle / 180);
    helperCanvas.context.translate(-x, -y);

    return helperCanvas;
};
export const drawMaskedWithRotation = (
    maskImageData: ImageData,
    angle: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
) => (helperCanvas: HelperCanvas): HelperCanvas => {
    drawMasked(
        maskImageData,
        drawWithRotation(angle, x, y, draw)
    )(helperCanvas);

    return helperCanvas;
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
) => (helperCanvas: HelperCanvas): HelperCanvas => {

    const {context} = helperCanvas;

    context.translate(x, y);

    context.rotate(-Math.PI * angleD / 180);
    context.translate(xd, yd);

    context.translate(xc, yc);
    context.rotate(Math.PI * angleB / 180);
    context.translate(-xc, -yc);

    draw(helperCanvas);

    context.resetTransform();

    return helperCanvas;
};
export const drawMaskedWithRotationAndOffset = (
    maskImageData: ImageData,
    angleB: number,
    angleD: number,
    xc: number, yc: number,
    xd: number, yd: number,
    x: number, y: number,
    draw: DrawMaskedDrawFunction,
) => (helperCanvas: HelperCanvas): HelperCanvas => {
    drawMasked(
        maskImageData,
        drawWithRotationAndOffset(angleB, angleD, xc, yc, xd, yd, x, y, draw)
    )(helperCanvas);

    return helperCanvas;
};