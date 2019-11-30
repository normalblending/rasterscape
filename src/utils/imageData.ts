export const canvasToImageData = (canvas: HTMLCanvasElement): ImageData =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
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

export const resizeImageData = (imageData: ImageData, width: number, height: number): ImageData => {
    const oldCanvas = imageDataToCanvas(imageData);
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;

    newCanvas.getContext("2d").drawImage(oldCanvas, 0, 0, width, height);

    return canvasToImageData(newCanvas);
};

export const imageDataToBase64 = (imageData: ImageData): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

export const base64ToImageData = (src: string): Promise<ImageData> => {
    return new Promise(resolve => {
        const image = new Image();
        image.src = src;
        image.onload = () => {

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return null;
            }

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))

        }
    });
};

export const maskedImage = (imageData: ImageData, maskImageData: ImageData): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }



    canvas.width = imageData.width;
    canvas.height = imageData.height;

    if (maskImageData) {
        ctx.putImageData(maskImageData, 0, 0);
        ctx.globalCompositeOperation = "source-in";
    }
    ctx.drawImage(imageDataToCanvas(imageData), 0, 0, imageData.width, imageData.height);

    return canvas;

};