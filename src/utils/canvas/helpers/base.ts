/**
 * очистить канвас
 */

export const clearCanvas = (canvas: HTMLCanvasElement): void =>
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
/**
 * создать вспомогательный канвас
 */

export const createCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    return {
        canvas, context
    }
};