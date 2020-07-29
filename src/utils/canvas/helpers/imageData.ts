import {createCanvas} from "./base";

export const canvasToImageData = (canvas: HTMLCanvasElement): ImageData =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {

    let {canvas, context} = createCanvas(imageData.width, imageData.height);

    context.putImageData(imageData, 0, 0);

    context = null;

    return canvas;
}

export const imageToImageData = (image): ImageData => {

    let {context} = createCanvas(image.width, image.height);

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, image.width, image.height);

    context = null;

    return imageData;
};


export const resizeImageData = (imageData: ImageData, width: number, height: number, noStretch?: boolean): ImageData => {
    const oldCanvas = imageDataToCanvas(imageData);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;


    const context = newCanvas.getContext("2d");

    context.imageSmoothingEnabled = false;

    !noStretch
        ? context.drawImage(oldCanvas, 0, 0, width, height)
        : context.drawImage(oldCanvas, 0, height - oldCanvas.height, oldCanvas.width, oldCanvas.height);

    return canvasToImageData(newCanvas);
};

export const imageDataToBase64 = (imageData: ImageData): string => {

    const {canvas, context} = createCanvas(imageData.width, imageData.height);

    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

export const base64ToImageData = (src: string): Promise<ImageData> => {
    return new Promise(resolve => {
        const image = new Image();
        image.src = src;
        image.onload = () => {

            const {canvas, context} = createCanvas(image.width, image.height);

            context.drawImage(image, 0, 0);

            resolve(context.getImageData(0, 0, canvas.width, canvas.height))

        }
    });
};

export const maskInverse = (maskImageData: ImageData): ImageData => {
    const maskInverse = copyImageData(maskImageData)
    for (let i = 0; i< maskInverse.data.length; i +=4) {
        maskInverse.data[i + 3] = 255 - maskInverse.data[i + 3];
    }
    return maskInverse;
};

export const getMaskedImage = (imageData: ImageData, maskImageData?: ImageData, inverseMask?: boolean): HTMLCanvasElement => {

    let {canvas, context} = createCanvas(imageData.width, imageData.height);

    if (maskImageData) {
        context.putImageData(
            inverseMask ? maskInverse(maskImageData) : maskImageData,
            0, 0);
        context.globalCompositeOperation = "source-in";
    }
    context.drawImage(imageDataToCanvas(imageData), 0, 0, imageData.width, imageData.height);

    return canvas;

};

export const copyImageData = (imageData: ImageData): ImageData => {
    return new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );
};


