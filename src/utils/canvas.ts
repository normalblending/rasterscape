import {CanvasState} from "./types";

// IMAGE, IMAGE DATA, CANVAS

export const canvasToImageData = (canvas: HTMLCanvasElement): ImageData =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

export function imagedataToCanvas(imageData: ImageData): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

export const resizeImageData = (imageData, width, height) => {
    const oldCanvas = imagedataToCanvas(imageData);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;

    newCanvas.getContext("2d").drawImage(oldCanvas, 0, 0, width, height);

    return canvasToImageData(newCanvas);
};

// DRAWINGS

export const clearCanvas = (canvas: HTMLCanvasElement): void =>
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

export const circle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void => {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};


// GEOMETRY

export const pointsDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
};
// STATE

export function createCleanCanvasState(width, height): CanvasState {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    const imageData = ctx.createImageData(width, height);

    // noise
    // for (let i = 0; i < imageData.data.length; i++) {
    //     imageData.data[i] = Math.random() * 100;
    // }

    return {
        imageData,
        width,
        height
    };
}

export function createCanvasStateFromImageData(imageData: ImageData, width?: number, height?: number): CanvasState {
    return {
        imageData,
        width: width || imageData.width,
        height: height || imageData.height
    };
}



// history