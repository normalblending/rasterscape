import {createCanvas} from "./base";

export const canvasToImageData = (canvas: HTMLCanvasElement): ImageData =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {

    const {canvas, context} = createCanvas(imageData.width, imageData.height);

    context.putImageData(imageData, 0, 0);

    return canvas;
}

export const imageToImageData = (image): ImageData => {

    const {context} = createCanvas(image.width, image.height);

    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
};


export const resizeImageData = (imageData: ImageData, width: number, height: number): ImageData => {
    const oldCanvas = imageDataToCanvas(imageData);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;


    const context = newCanvas.getContext("2d");

    context.imageSmoothingEnabled = false;


    context.drawImage(oldCanvas, 0, 0, width, height);

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

export const getMaskedImage = (imageData: ImageData, maskImageData?: ImageData): HTMLCanvasElement => {

    const {canvas, context} = createCanvas(imageData.width, imageData.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }
    context.drawImage(imageDataToCanvas(imageData), 0, 0, imageData.width, imageData.height);

    return canvas;

};


