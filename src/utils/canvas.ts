export const clearCanvas = (canvas: HTMLCanvasElement): void =>
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

export const circle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void => {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};