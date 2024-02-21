import {CanvasState} from "./canvas/types";

export function createCleanCanvasState(width: number, height: number): CanvasState {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    const imageData = ctx.createImageData(width, height);

    // noise
    // for (let i = 0; i < imageData.data.length; i++) {
    //     imageData.data[i] = Math.random() * 100;
    // }

    return {
        imageData,
    };
}

export function createCanvasStateFromImageData(imageData: ImageData): CanvasState {
    return {
        imageData,
    };
}