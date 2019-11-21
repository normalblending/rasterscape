import {CanvasState} from "./types";

export function createCleanCanvasState(width: number, height: number): CanvasState {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    const imageData = ctx.createImageData(width, height);

    // noise
    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = Math.random() * 100;
    }

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