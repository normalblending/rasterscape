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

export const resizeImageData = (imageData: ImageData, width: number, height: number): ImageData => {
    const oldCanvas = imagedataToCanvas(imageData);
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

// base64ToImageData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAgMAAABGuH3ZAAAAAXNSR0IArs4c6QAAAAlQTFRFAAANAAAA/PxQjQj98QAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gwXFQ4DaigKYQAAADhJREFUCNdjYBANYGBgzFrKwMC2apUDg1TUtAkQImvVqiXoROaqlUsYpLKWAZVMjZoA0QHWCzIFAJGSGI4XxkZDAAAAAElFTkSuQmCC").then(d => console.log(d))